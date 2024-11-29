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
const QueryProfile_1 = __importDefault(require("../operations/QueryProfile"));
const ClientQuestLogin_1 = __importDefault(require("../operations/ClientQuestLogin"));
const athena = require("../responses/DefaultProfiles/athena.json");
const common_public = require("../responses/DefaultProfiles/common_public.json");
const common_core = require("../responses/DefaultProfiles/common_core.json");
function mcpRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/:operation', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId, operation } = request.params;
                const { profileId, rvn } = request.query;
                switch (operation) {
                    case "QueryProfile":
                        const queryProfile = yield QueryProfile_1.default.QueryProfile(accountId, profileId, Number(rvn));
                        return reply.status(200).send({ queryProfile });
                    case "ClientQuestLogin":
                        const clientQuestLogin = yield ClientQuestLogin_1.default.ClientQuestLogin(accountId, profileId, Number(rvn));
                        return reply.status(200).send({ clientQuestLogin });
                    case "SetMtxPlatform":
                        return reply.status(200).send({
                            status: "OK",
                            code: 200
                        });
                    case "ClaimMfaEnabled":
                        return reply.status(200).send({
                            status: "OK",
                            code: 200
                        });
                    default:
                        console.warn(`Operation ${operation} is not supported`);
                        return reply.status(400).send({
                            error: 'arcane.errors.operation.unknown',
                            error_description: `Operation ${operation} is not supported`,
                            code: 400
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
