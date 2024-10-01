const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    accountId: { type: String, required: true },
    profileId: { type: String, required: true },
    profileRevision: { type: Number, default: 1 },
    profileChangesBaseRevision: { type: Number, default: 1 },
    profileChanges: { type: Array, default: [] },
    profileCommandRevision: { type: Number, default: 1 },
    serverTime: { type: Date, default: Date.now },
    responseVersion: { type: Number, default: 1 },
    profiles: {
        type: Object,
        required: true,
        default: {
            athena: {
                customization: {
                    character: { type: String, default: "AthenaCharacter:CID_001_Athena_Commando_F_Default" },
                    backpack: { type: String, default: "AthenaBackpack:DefaultBackpack" },
                    pickaxe: { type: String, default: "AthenaPickaxe:DefaultPickaxe" },
                    emote: { type: String, default: "AthenaDance:EID_DanceMoves" },
                },
                stats: {
                    attributes: {
                        loadouts: { type: Array, default: [] },
                        active_loadout_index: { type: Number, default: 0 },
                        last_applied_loadout: { type: String, default: "" },
                    }
                }
            }
        }
    }
}, {
    collection: "profiles"
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;