import profileman from "../utils/user/profileman";

import User from "../database/models/user";
import Profiles from "../database/models/profiles";

// dont rlly know if i need anything else here tbh
async function QueryProfile(accountId: string, profileId: string, rvn: number) {
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

    return profileData;
}

export default {
    QueryProfile
}