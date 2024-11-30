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
function EquipBattleRoyaleCustomization(accountId, profileId, rvn, body, memory) {
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
        }
        else if (body.slotName == "ItemWrap") {
            profile.stats.attributes.favorite_itemwraps[body.indexWithinSlot] = body.itemToSlot;
            profile.items[activeLoadout].attributes.locker_slots_data.slots.ItemWrap.items[body.indexWithinSlot] = body.itemToSlot;
            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "favorite_itemwraps",
                "value": profile.stats.attributes["favorite_itemwraps"]
            });
        }
        else {
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
            yield profiles.updateOne({ $set: { [`profiles.${profileId}`]: profile } });
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
    });
}
exports.default = {
    EquipBattleRoyaleCustomization
};
