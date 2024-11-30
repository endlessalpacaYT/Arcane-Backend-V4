import profileman from "../utils/user/profileman";

import User from "../database/models/user";
import Profiles from "../database/models/profiles";

interface Memory {
  season: number;
  build: number;
  CL: string;
  lobby: string;
}

async function QueryProfile(accountId: string, profileId: string, rvn: number, memory: Memory) {
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

  if (profile.rvn == profile.commandRevision) {
    profile.rvn += 1;

    if (profileId == "athena") {
      if (!profile.stats.attributes.last_applied_loadout) profile.stats.attributes.last_applied_loadout = profile.stats.attributes.loadouts[0];
    }

    await profiles.updateOne({ $set: { [`profiles.${profileId}`]: profile } });
  }
  if (profileId == "athena") profile.stats.attributes.season_num = memory.season;

  let multiUpdate = [];
  let ApplyProfileChanges = [];
  let BaseRevision = profile.rvn;
  let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
  let QueryRevision = rvn || -1;

  try {
    if ((profileId == "common_core") && global.giftReceived[accountId]) {
      global.giftReceived[accountId] = false;

      let athena = profiles.profiles["athena"];

      multiUpdate = [{
        "profileRevision": athena.rvn || 0,
        "profileId": "athena",
        "profileChangesBaseRevision": athena.rvn || 0,
        "profileChanges": [{
          "changeType": "fullProfileUpdate",
          "profile": athena
        }],
        "profileCommandRevision": athena.commandRevision || 0,
      }];
    }
  } catch { }

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
  QueryProfile,
};
