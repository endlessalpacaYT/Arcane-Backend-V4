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
exports.accountRoutes = accountRoutes;
function accountRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/fortnite/api/game/v2/tryPlayOnPlatform/account/:accountId', (request, reply) => {
            reply.header("Content-Type", "text/plain");
            return reply.status(200).send("true");
        });
        fastify.get('/account/api/public/account/:accountId/externalAuths', (request, reply) => {
            return reply.status(200).send([]);
        });
        fastify.get('/fortnite/api/game/v2/enabled_features', (request, reply) => {
            return reply.status(200).send([]);
        });
        fastify.get('/content-controls/:accountId', (request, reply) => {
            return reply.status(200).send([]);
        });
        fastify.get('/account/api/public/account', (request, reply) => {
            const { accountId } = request.query;
            return reply.status(200).send({
                id: accountId,
                displayName: accountId,
                externalAuth: {}
            });
        });
        fastify.get("/account/api/public/account/:accountId", (request, reply) => {
            const { accountId } = request.params;
            return reply.status(200).send({
                id: accountId,
                displayName: accountId,
                name: accountId,
                email: `${accountId}@arcane.dev`,
                failedLoginAttempts: 0,
                lastLogin: Date.now(),
                numberOfDisplayNameChanges: 0,
                ageGroup: "UNKNOWN",
                headless: false,
                country: "US",
                lastName: "User",
                links: {},
                preferredLanguage: "en",
                canUpdateDisplayName: false,
                tfaEnabled: true,
                emailVerified: true,
                minorVerified: true,
                minorExpected: true,
                minorStatus: "UNKNOWN",
            });
        });
        fastify.post('/api/v1/user/setting', (request, reply) => {
            return reply.status(200).send({
                status: "OK",
                code: 200
            });
        });
    });
}
