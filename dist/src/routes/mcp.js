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
const functions_1 = __importDefault(require("../utils/functions"));
const QueryProfile_1 = __importDefault(require("../operations/QueryProfile"));
const ClientQuestLogin_1 = __importDefault(require("../operations/ClientQuestLogin"));
const SetHardcoreModifier_1 = __importDefault(require("../operations/SetHardcoreModifier"));
const RefreshExpeditions_1 = __importDefault(require("../operations/RefreshExpeditions"));
const SetCosmeticLockerBanner_1 = __importDefault(require("../operations/SetCosmeticLockerBanner"));
const Fallback_1 = __importDefault(require("../operations/Fallback"));
const athena = require("../responses/DefaultProfiles/athena.json");
const common_public = require("../responses/DefaultProfiles/common_public.json");
const common_core = require("../responses/DefaultProfiles/common_core.json");
function mcpRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId } = request.params;
                const { profileId, rvn } = request.query;
                const memory = functions_1.default.GetVersionInfo(request);
                const queryProfile = yield QueryProfile_1.default.QueryProfile(accountId, profileId, Number(rvn), memory);
                return reply.status(200).send(queryProfile);
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
                const { profileId, rvn } = request.query;
                const memory = functions_1.default.GetVersionInfo(request);
                const clientQuestLogin = yield ClientQuestLogin_1.default.ClientQuestLogin(accountId, profileId, Number(rvn), memory);
                return reply.status(200).send({ clientQuestLogin });
            }
            catch (err) {
                console.error(err);
                return reply.status(500).send({
                    error: "SERVER ERROR"
                });
            }
        }));
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetHardcoreModifier', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId } = request.params;
                const { profileId, rvn } = request.query;
                const memory = functions_1.default.GetVersionInfo(request);
                const setHardcoreModifier = yield SetHardcoreModifier_1.default.SetHardcoreModifier(accountId, profileId, Number(rvn), memory);
                return reply.status(200).send({ setHardcoreModifier });
            }
            catch (err) {
                console.error(err);
                return reply.status(500).send({
                    error: "SERVER ERROR"
                });
            }
        }));
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/RefreshExpeditions', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId } = request.params;
                const { profileId, rvn } = request.query;
                const memory = functions_1.default.GetVersionInfo(request);
                const refreshExpeditions = yield RefreshExpeditions_1.default.RefreshExpeditions(accountId, profileId, Number(rvn), memory);
                return reply.status(200).send({ refreshExpeditions });
            }
            catch (err) {
                console.error(err);
                return reply.status(500).send({
                    error: "SERVER ERROR"
                });
            }
        }));
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerBanner', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId } = request.params;
                const { profileId, rvn } = request.query;
                console.log(request.query);
                console.log(request.body);
                const memory = functions_1.default.GetVersionInfo(request);
                const setCosmeticLockerBanner = yield SetCosmeticLockerBanner_1.default.SetCosmeticLockerBanner(accountId, profileId, Number(rvn), request.body, memory);
                return reply.status(200).send({ setCosmeticLockerBanner });
            }
            catch (err) {
                console.error(err);
                return reply.status(500).send({
                    error: "SERVER ERROR"
                });
            }
        }));
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/:operation', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId, operation } = request.params;
                const { profileId, rvn } = request.query;
                console.warn(`Operation ${operation} is not supported`);
                const fallback = yield Fallback_1.default.Fallback(accountId, profileId, Number(rvn));
                return reply.status(200).send({ fallback });
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
