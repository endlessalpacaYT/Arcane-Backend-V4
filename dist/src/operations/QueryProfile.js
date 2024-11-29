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
// dont rlly know if i need anything else here tbh
function QueryProfile(accountId, profileId, rvn) {
    return __awaiter(this, void 0, void 0, function* () {
        let profile = yield profiles_1.default.findOne({ accountId: accountId });
        if (!profile) {
            profile = yield profileman_1.default.createProfile(accountId);
        }
        const profileData = yield profileman_1.default.getProfile(profileId, accountId);
        if (!profileData) {
            return {
                error: "arcane.errors.profile.not_found"
            };
        }
        profileman_1.default.updateProfileRvn(rvn, profileId, accountId);
        return profileData;
    });
}
exports.default = {
    QueryProfile
};
