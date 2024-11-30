"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const profileman_1 = __importDefault(require("../utils/user/profileman"));
const profiles_1 = __importDefault(require("../database/models/profiles"));
function QueryProfile(accountId, profileId, rvn, memory) {
    return __awaiter(this, void 0, void 0, function* () {
        let profiles = yield profiles_1.default.findOne({ accountId: accountId });
        if (!profiles) {
            console.log(`Profile for accountId ${accountId} not found. Creating a new one.`);
            profiles = yield profileman_1.default.createProfile(accountId);
            if (!profiles) {
                throw new Error("Failed to create a new profile");
            }
        }
        const profile = profiles.profiles[profileId];
        if (!profile) {
            console.error(`Profile with ID ${profileId} for accountId ${accountId} not found.`);
            return {
                error: "arcane.errors.profile.not_found",
            };
        }
        if (profile.rvn == profile.commandRevision) {
            profile.rvn += 1;
            if (profileId == "athena") {
                if (!profile.stats.attributes.last_applied_loadout)
                    profile.stats.attributes.last_applied_loadout = profile.stats.attributes.loadouts[0];
            }
            yield profiles.updateOne({ $set: { [`profiles.${profileId}`]: profile } });
        }
        if (profileId == "athena")
            profile.stats.attributes.season_num = memory.season;
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
        }
        catch (_a) { }
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
    });
}
exports.default = {
    QueryProfile,
};
