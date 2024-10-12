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
exports.authRoutes = authRoutes;
function authRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/account/api/oauth/token', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            reply.header('Content-Type', 'application/json');
            return reply.status(200).send({
                "access_token": "ArcaneV4",
                "expires_in": 28800,
                "expires_at": "9999-12-02T01:12:01.100Z",
                "token_type": "bearer",
                "refresh_token": "ArcaneV4",
                "refresh_expires": 86400,
                "refresh_expires_at": "9999-12-02T01:12:01.100Z",
                "account_id": "ArcaneV4",
                "client_id": "ArcaneV4",
                "internal_client": true,
                "client_service": "fortnite",
                "displayName": "ArcaneV4",
                "app": "fortnite",
                "in_app_id": "ArcaneV4",
                "device_id": "ArcaneV4"
            });
        }));
        fastify.get('/account/api/oauth/verify', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            reply.header('Content-Type', 'application/json');
            return reply.status(200).send({
                "access_token": "ArcaneV4",
                "expires_in": 28800,
                "expires_at": "9999-12-02T01:12:01.100Z",
                "token_type": "bearer",
                "refresh_token": "ArcaneV4",
                "refresh_expires": 86400,
                "refresh_expires_at": "9999-12-02T01:12:01.100Z",
                "account_id": "ArcaneV4",
                "client_id": "ArcaneV4",
                "internal_client": true,
                "client_service": "fortnite",
                "displayName": "ArcaneV4",
                "app": "fortnite",
                "in_app_id": "ArcaneV4",
                "device_id": "ArcaneV4"
            });
        }));
        fastify.delete("/account/api/oauth/sessions/kill", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            reply.header('Content-Type', 'application/json');
            reply.status(200).send({
                status: "OK",
                code: 200
            });
        }));
        fastify.delete("/account/api/oauth/sessions/kill/:token", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            reply.header('Content-Type', 'application/json');
            reply.status(200).send({
                status: "OK",
                code: 200
            });
        }));
    });
}
