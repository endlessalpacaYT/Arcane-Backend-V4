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
    lockerItem: string,
    bannerIconTemplateName: string,
    bannerColorTemplateName: string
}

async function SetCosmeticLockerBanner(accountId: string, profileId: string, rvn: number, body: Body, memory: Memory) {
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

    profile.items[body.lockerItem].attributes.banner_icon_template = body.bannerIconTemplateName;
    profile.items[body.lockerItem].attributes.banner_color_template = body.bannerColorTemplateName;

    ApplyProfileChanges.push({
        "changeType": "itemAttrChanged",
        "itemId": body.lockerItem,
        "attributeName": "banner_icon_template",
        "attributeValue": profile.items[body.lockerItem].attributes.banner_icon_template
    });

    ApplyProfileChanges.push({
        "changeType": "itemAttrChanged",
        "itemId": body.lockerItem,
        "attributeName": "banner_color_template",
        "attributeValue": profile.items[body.lockerItem].attributes.banner_color_template
    });

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
    SetCosmeticLockerBanner
}