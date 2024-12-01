import profileman from "../utils/user/profileman";

import User from "../database/models/user";
import Profiles from "../database/models/profiles";

interface Memory {
    season: number;
    build: number;
    CL: string;
    lobby: string;
}

interface Body {
    counterName: string;
}

async function IncrementNamedCounterStat(accountId: string, profileId: string, rvn: number, memory: Memory, body: Body) {
    let profiles: any = await Profiles.findOne({ accountId: accountId });
    if (!profiles) {
        console.log(
            `Profile for accountId ${accountId} not found. Creating a new one.`
        );
        profiles = await profileman.createProfile(accountId);

        if (!profiles) {
            throw new Error("Failed to create a new profile");
        }
    }

    const profile: any = profiles.profiles[profileId];
    if (!profile) {
        console.error(
            `Profile with ID ${profileId} for accountId ${accountId} not found.`
        );
        return {
            error: "arcane.errors.profile.not_found",
        };
    }

    let multiUpdate = [];
    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = rvn || -1;

    try {
        profile.stats.attributes.named_counters[body.counterName].current_count = profile.stats.attributes.named_counters[body.counterName].current_count + 1;
        profile.stats.attributes.named_counters[body.counterName].last_incremented_time = new Date().toISOString();

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": body.counterName,
            "attributeName": "current_count",
            "attributeValue": profile.stats.attributes.named_counters[body.counterName].current_count
        });
    
        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": body.counterName,
            "attributeName": "last_incremented_time",
            "attributeValue": profile.stats.attributes.named_counters[body.counterName].last_incremented_time
        });
    } catch { }

    if (ApplyProfileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${profileId}`]: profile } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    const data = {
        profileRevision: profile.rvn || 0,
        profileId: profileId,
        profileChangesBaseRevision: profile.rvn || 0,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        multiUpdate: multiUpdate,
        responseVersion: 1,
    };

    return data;
}

export default {
    IncrementNamedCounterStat
}