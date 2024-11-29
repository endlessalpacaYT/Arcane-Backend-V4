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
const profiles_1 = __importDefault(require("../../database/models/profiles"));
const athena = require("../../responses/DefaultProfiles/athena.json");
const campaign = require("../../responses/DefaultProfiles/campaign.json");
const collection_book_people0 = require("../../responses/DefaultProfiles/collection_book_people0.json");
const collection_book_schematics0 = require("../../responses/DefaultProfiles/collection_book_schematics0.json");
const collections = require("../../responses/DefaultProfiles/collections.json");
const common_public = require("../../responses/DefaultProfiles/common_public.json");
const common_core = require("../../responses/DefaultProfiles/common_core.json");
const creative = require("../../responses/DefaultProfiles/creative.json");
const metadata = require("../../responses/DefaultProfiles/metadata.json");
const outpost0 = require("../../responses/DefaultProfiles/outpost0.json");
const profile0 = require("../../responses/DefaultProfiles/profile0.json");
const theater0 = require("../../responses/DefaultProfiles/theater0.json");
function createProfile(accountId) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = new profiles_1.default({
            created: new Date(),
            accountId: accountId,
            profiles: {
                athena: athena,
                campaign: campaign,
                collection_book_people0: collection_book_people0,
                collection_book_schematics0: collection_book_schematics0,
                collections: collections,
                common_public: common_public,
                common_core: common_core,
                creative: creative,
                metadata: metadata,
                outpost0: outpost0,
                profile0: profile0,
                theater0: theater0
            }
        });
        profile.profiles.athena.accountId = accountId;
        profile.profiles.campaign.accountId = accountId;
        profile.profiles.collection_book_people0.accountId = accountId;
        profile.profiles.collection_book_schematics0.accountId = accountId;
        profile.profiles.collections.accountId = accountId;
        profile.profiles.common_public.accountId = accountId;
        profile.profiles.common_core.accountId = accountId;
        profile.profiles.creative.accountId = accountId;
        profile.profiles.metadata.accountId = accountId;
        profile.profiles.outpost0.accountId = accountId;
        profile.profiles.profile0.accountId = accountId;
        profile.profiles.theater0.accountId = accountId;
        yield profile.save();
        console.log("Database Saved Profile");
        return profile;
    });
}
function updateProfileRvn(rvnNumber, profileId, accountId) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield profiles_1.default.findOne({ accountId: accountId });
        if (!profile) {
            return console.error("No profile with the accountId: " + accountId);
        }
        switch (profileId) {
            case "athena":
                profile.profiles.athena.rvn = rvnNumber;
                break;
            case "campaign":
                profile.profiles.campaign.rvn = rvnNumber;
                break;
            case "collection_book_people0":
                profile.profiles.collection_book_people0.rvn = rvnNumber;
                break;
            case "collection_book_schematics0":
                profile.profiles.collection_book_schematics0.rvn = rvnNumber;
                break;
            case "collections":
                profile.profiles.collection.rvn = rvnNumber;
                break;
            case "common_core":
                profile.profiles.common_core.rvn = rvnNumber;
                break;
            case "common_public":
                profile.profiles.common_public.rvn = rvnNumber;
                break;
            case "creative":
                profile.profiles.creative.rvn = rvnNumber;
                break;
            case "metadata":
                profile.profiles.metadata.rvn = rvnNumber;
                break;
            case "outpost0":
                profile.profiles.outpost0.rvn = rvnNumber;
                break;
            case "profile0":
                profile.profiles.profile0.rvn = rvnNumber;
                break;
            case "theater0":
                profile.profiles.theater0.rvn = rvnNumber;
                break;
            default:
                console.log("No profile found for the rvn change!");
                break;
        }
        yield profile.save();
    });
}
function getProfile(profileId, accountId) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield profiles_1.default.findOne({ accountId: accountId });
        if (!profile) {
            console.error("No profile with the accountId: " + accountId);
            return null;
        }
        switch (profileId) {
            case "athena":
                return profile.profiles.athena;
            case "campaign":
                return profile.profiles.campaign;
            case "collection_book_people0":
                return profile.profiles.collection_book_people0;
            case "collection_book_schematics0":
                return profile.profiles.collection_book_schematics0;
            case "collections":
                return profile.profiles.collections;
            case "common_core":
                return profile.profiles.common_core;
            case "common_public":
                return profile.profiles.common_public;
            case "creative":
                return profile.profiles.creative;
            case "metadata":
                return profile.profiles.metadata;
            case "outpost0":
                return profile.profiles.outpost0;
            case "profile0":
                return profile.profiles.profile0;
            case "theater0":
                return profile.profiles.theater0;
            default:
                console.warn(profileId + ": Not Found");
                return null;
        }
    });
}
exports.default = {
    createProfile,
    updateProfileRvn,
    getProfile
};
