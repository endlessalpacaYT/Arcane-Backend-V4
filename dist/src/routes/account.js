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
exports.accountRoutes = accountRoutes;
const user_1 = __importDefault(require("../database/models/user"));
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
        fastify.get('/account/api/public/account', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { accountId } = request.query;
            const user = yield user_1.default.findOne({ accountId: accountId });
            if (!user) {
                return reply.status(404).send({
                    error: "arcane.errors.user.not_found",
                    error_description: "The user was not found in the database",
                    code: 404
                });
            }
            return reply.status(200).send({
                id: user.accountId,
                displayName: user.username,
                externalAuth: {}
            });
        }));
        fastify.get("/account/api/public/account/:accountId", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { accountId } = request.params;
            const user = yield user_1.default.findOne({ accountId: accountId });
            if (!user) {
                return reply.status(404).send({
                    error: "arcane.errors.user.not_found",
                    error_description: "The user was not found in the database",
                    code: 404
                });
            }
            return reply.status(200).send({
                id: user.accountId,
                displayName: user.username,
                name: user.username,
                email: user.email,
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
        }));
        fastify.post('/api/v1/user/setting', (request, reply) => {
            return reply.status(200).send({
                status: "OK",
                code: 200
            });
        });
        fastify.get('/socialban/api/public/v1/:accountId', (request, reply) => {
            return reply.status(200).send([]);
        });
        fastify.get('/presence/api/v1/_/:accountId/settings/subscriptions', (request, reply) => {
            return reply.status(200).send([]);
        });
        fastify.get('/fortnite/api/game/v2/privacy/account/:accountId', (request, reply) => {
            return reply.status(200).send([]);
        });
    });
}
