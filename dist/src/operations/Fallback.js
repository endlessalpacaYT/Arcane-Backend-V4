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
function Fallback(accountId, profileId, rvn) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("An error occurred in Fallback:", err.message);
                return {
                    error: "arcane.errors.internal_server_error",
                    message: err.message,
                };
            }
            else {
                console.error("An unknown error occurred.");
                return {
                    error: "arcane.errors.unknown_error",
                };
            }
        }
    });
}
function validateRvn(providedRvn, currentRvn) {
    return providedRvn >= currentRvn;
}
exports.default = {
    Fallback,
};
