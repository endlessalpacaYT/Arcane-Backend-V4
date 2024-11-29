import profileman from "../utils/user/profileman";
import Profiles from "../database/models/profiles";

async function Fallback(accountId: string, profileId: string, rvn: number) {
    try {
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

        const data = {
            profileRevision: profile.rvn || 0,
            profileId: profileId,
            profileChangesBaseRevision: profile.rvn || 0,
            profileChanges: [],
            profileCommandRevision: profile.commandRevision || 0,
            serverTime: new Date().toISOString(),
            multiUpdate: [],
            responseVersion: 1,
        };

        return data;
    } catch (err) {
        if (err instanceof Error) {
            console.error("An error occurred in Fallback:", err.message);
            return {
                error: "arcane.errors.internal_server_error",
                message: err.message,
            };
        } else {
            console.error("An unknown error occurred.");
            return {
                error: "arcane.errors.unknown_error",
            };
        }
    }
}

function validateRvn(providedRvn: number, currentRvn: number): boolean {
    return providedRvn >= currentRvn;
}

export default {
    Fallback,
};
