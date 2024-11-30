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
    slotName: string;
    itemToSlot: string;
    indexWithinSlot: number;
    variantUpdates: Array<any>;
}

async function EquipBattleRoyaleCustomization(accountId: string, profileId: string, rvn: number, body: Body, memory: Memory) {
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

    let activeLoadout = profile.stats.attributes.loadouts[profile.stats.attributes.active_loadout_index];
    if (body.slotName == "Dance") {
        profile.stats.attributes.favorite_dance[body.indexWithinSlot] = body.itemToSlot;
        profile.items[activeLoadout].attributes.locker_slots_data.slots.Dance.items[body.indexWithinSlot] = body.itemToSlot;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "favorite_dance",
            "value": profile.stats.attributes["favorite_dance"]
        });
    } else if (body.slotName == "ItemWrap") {
        profile.stats.attributes.favorite_itemwraps[body.indexWithinSlot] = body.itemToSlot;
        profile.items[activeLoadout].attributes.locker_slots_data.slots.ItemWrap.items[body.indexWithinSlot] = body.itemToSlot;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "favorite_itemwraps",
            "value": profile.stats.attributes["favorite_itemwraps"]
        });
    } else {
        profile.stats.attributes[(`favorite_${body.slotName}`).toLowerCase()] = body.itemToSlot;
        profile.items[activeLoadout].attributes.locker_slots_data.slots[body.slotName].items = body.itemToSlot;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": (`favorite_${body.slotName}`).toLowerCase(),
            "value": profile.stats.attributes[(`favorite_${body.slotName}`).toLowerCase()]
        });
    }

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
    EquipBattleRoyaleCustomization
}