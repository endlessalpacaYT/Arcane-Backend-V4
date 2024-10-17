import profileman from "../utils/user/profileman";

import User from "../database/models/user";
import Profiles from "../database/models/profiles";

async function ClientQuestLogin(accountId: string, profileId: string, rvn: number) {
    let profile = await Profiles.findOne({ accountId: accountId });
    if (!profile) {
        profile = await profileman.createProfile(accountId);
    }

    const profileData = await profileman.getProfile(profileId, accountId);
    if (!profileData) {
        return {
            error: "arcane.errors.profile.not_found"
        }
    }
    profileman.updateProfileRvn(rvn, profileId, accountId)

    const profileChange = [{
        "changeType": "fullProfileUpdate",
        "profile": profileData
    }];

    return {
        "profileRevision": rvn,
        "profileId": profileId,
        "profileChangesBaseRevision": rvn,
        "profileChanges": profileChange,  
        "profileCommandRevision": 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    };
}

export default {
    ClientQuestLogin
}