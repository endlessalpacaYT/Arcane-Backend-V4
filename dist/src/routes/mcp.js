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
exports.mcpRoutes = mcpRoutes;
const profileman_1 = __importDefault(require("../utils/user/profileman"));
const profiles_1 = __importDefault(require("../database/models/profiles"));
const athena = require("../responses/DefaultProfiles/athena.json");
const common_public = require("../responses/DefaultProfiles/common_public.json");
const common_core = require("../responses/DefaultProfiles/common_core.json");
function mcpRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId } = request.params;
                let { rvn } = request.query;
                let profile = yield profiles_1.default.findOne({ accountId: accountId });
                if (!profile) {
                    profile = yield profileman_1.default.createProfile(accountId);
                }
                const rvnNumber = Number(rvn);
                if (request.query.profileId == "common_public") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "common_public", accountId);
                    return reply.status(200).send(profile.profiles.common_public);
                }
                else if (request.query.profileId == "common_core") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "common_core", accountId);
                    return reply.status(200).send(profile.profiles.common_core);
                }
                else if (request.query.profileId == "athena") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "athena", accountId);
                    return reply.status(200).send(profile.profiles.athena);
                }
                else if (request.query.profileId == "creative") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "creative", accountId);
                    return reply.status(200).send(profile.profiles.athena);
                }
                else {
                    return reply.status(200).send({
                        status: "OK",
                        code: 200
                    });
                }
            }
            catch (err) {
                console.error(err);
                return reply.status(500).send({
                    error: "SERVER ERROR"
                });
            }
        }));
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId } = request.params;
                let { rvn } = request.query;
                let profile = yield profiles_1.default.findOne({ accountId: accountId });
                if (!profile) {
                    profile = yield profileman_1.default.createProfile(accountId);
                }
                const rvnNumber = Number(rvn);
                if (request.query.profileId == "common_public") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "common_public", accountId);
                    return reply.status(200).send(profile.profiles.common_public);
                }
                else if (request.query.profileId == "common_core") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "common_core", accountId);
                    return reply.status(200).send(profile.profiles.common_core);
                }
                else if (request.query.profileId == "athena") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "athena", accountId);
                    return reply.status(200).send(profile.profiles.athena);
                }
                else if (request.query.profileId == "creative") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "creative", accountId);
                    return reply.status(200).send(profile.profiles.athena);
                }
                else {
                    return reply.status(200).send({
                        status: "OK",
                        code: 200
                    });
                }
            }
            catch (err) {
                console.error(err);
                return reply.status(500).send({
                    error: "SERVER ERROR"
                });
            }
        }));
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClaimMfaEnabled', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId } = request.params;
                let { rvn } = request.query;
                let profile = yield profiles_1.default.findOne({ accountId: accountId });
                if (!profile) {
                    profile = yield profileman_1.default.createProfile(accountId);
                }
                const rvnNumber = Number(rvn);
                if (request.query.profileId == "common_public") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "common_public", accountId);
                    return reply.status(200).send(profile.profiles.common_public);
                }
                else if (request.query.profileId == "common_core") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "common_core", accountId);
                    return reply.status(200).send(profile.profiles.common_core);
                }
                else if (request.query.profileId == "athena") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "athena", accountId);
                    return reply.status(200).send(profile.profiles.athena);
                }
                else if (request.query.profileId == "creative") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "creative", accountId);
                    return reply.status(200).send(profile.profiles.athena);
                }
                else {
                    return reply.status(200).send({
                        status: "OK",
                        code: 200
                    });
                }
            }
            catch (err) {
                console.error(err);
                return reply.status(500).send({
                    error: "SERVER ERROR"
                });
            }
        }));
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId } = request.params;
                let { rvn } = request.query;
                let profile = yield profiles_1.default.findOne({ accountId: accountId });
                if (!profile) {
                    profile = yield profileman_1.default.createProfile(accountId);
                }
                const rvnNumber = Number(rvn);
                if (request.query.profileId == "common_public") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "common_public", accountId);
                    return reply.status(200).send(profile.profiles.common_public);
                }
                else if (request.query.profileId == "common_core") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "common_core", accountId);
                    return reply.status(200).send(profile.profiles.common_core);
                }
                else if (request.query.profileId == "athena") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "athena", accountId);
                    return reply.status(200).send(profile.profiles.athena);
                }
                else if (request.query.profileId == "creative") {
                    profileman_1.default.updateProfileRvn(rvnNumber, "creative", accountId);
                    return reply.status(200).send(profile.profiles.athena);
                }
                else {
                    return reply.status(200).send({
                        status: "OK",
                        code: 200
                    });
                }
            }
            catch (err) {
                console.error(err);
                return reply.status(500).send({
                    error: "SERVER ERROR"
                });
            }
        }));
    });
}
