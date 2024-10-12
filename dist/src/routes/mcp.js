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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpRoutes = mcpRoutes;
const athena = require("../responses/DefaultProfiles/athena.json");
const common_public = require("../responses/DefaultProfiles/common_public.json");
const common_core = require("../responses/DefaultProfiles/common_core.json");
function mcpRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', (request, reply) => {
            if (request.query.profileId == "common_public") {
                return reply.status(200).send(common_public);
            }
            else if (request.query.profileId == "common_core") {
                return reply.status(200).send(common_core);
            }
            else {
                return reply.status(200).send({
                    status: "OK",
                    code: 200
                });
            }
        });
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform', (request, reply) => {
            if (request.query.profileId == "common_core") {
                return reply.status(200).send(common_core);
            }
            else {
                return reply.status(200).send({
                    status: "OK",
                    code: 200
                });
            }
        });
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClaimMfaEnabled', (request, reply) => {
            if (request.query.profileId == "common_core") {
                return reply.status(200).send(common_core);
            }
            else {
                return reply.status(200).send({
                    status: "OK",
                    code: 200
                });
            }
        });
        fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', (request, reply) => {
            if (request.query.profileId == "athena") {
                return reply.status(200).send(athena);
            }
            else {
                return reply.status(200).send({
                    status: "OK",
                    code: 200
                });
            }
        });
    });
}
