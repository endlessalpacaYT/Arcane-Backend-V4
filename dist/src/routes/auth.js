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
exports.authRoutes = authRoutes;
require("dotenv").config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../database/models/user"));
const jwt_secret = process.env.JWT_SECRET;
function authRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post('/account/api/oauth/token', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                reply.header('Content-Type', 'application/json');
                const { grant_type } = request.body;
                if (grant_type == "password") {
                    const { username, password, token_type } = request.body;
                    if (!username || !password || !token_type) {
                        return reply.status(404).send({
                            error: "arcane.errors.common.not_found",
                            error_description: "username or password or token_type not found in body",
                            code: 404
                        });
                    }
                    const user = yield user_1.default.findOne({ email: username });
                    if (!user) {
                        return reply.status(404).send({
                            error: "arcane.errors.user.not_found",
                            error_description: "The user was not found in the database",
                            code: 404
                        });
                    }
                    const verifiedPass = yield bcrypt_1.default.compare(password.toString(), user.password.toString());
                    if (!verifiedPass) {
                        return reply.status(403).send({
                            error: "arcane.errors.invalid.password",
                            error_description: "invalid password",
                            code: 403
                        });
                    }
                    if (!jwt_secret) {
                        return reply.status(403).send({
                            error: "arcane.errors.token.invalid",
                            error_description: "The token system had an error",
                            code: 403
                        });
                    }
                    const refresh_token = jsonwebtoken_1.default.sign({
                        accountId: user.accountId
                    }, jwt_secret, { expiresIn: "24h" });
                    const access_token = jsonwebtoken_1.default.sign({
                        accountId: user.accountId,
                        username: user.username,
                        refresh_token: `eg1~${refresh_token}`,
                    }, jwt_secret, { expiresIn: "8h" });
                    return reply.status(200).send({
                        "access_token": `eg1~${access_token}`,
                        "expires_in": 28800,
                        "expires_at": "9999-12-02T01:12:01.100Z",
                        "token_type": "bearer",
                        "refresh_token": `eg1~${refresh_token}`,
                        "refresh_expires": 86400,
                        "refresh_expires_at": "9999-12-02T01:12:01.100Z",
                        "account_id": user.accountId,
                        "client_id": "ArcaneV4",
                        "internal_client": true,
                        "client_service": "fortnite",
                        "displayName": user.username,
                        "app": "fortnite",
                        "in_app_id": user.accountId,
                        "device_id": user.accountId
                    });
                }
                else if (grant_type == "client_credentials") {
                    const { token_type } = request.body;
                    if (!token_type) {
                        return reply.status(404).send({
                            error: "arcane.errors.common.not_found",
                            error_description: "token_type not found in body",
                            code: 404
                        });
                    }
                    return reply.code(200).send({
                        access_token: `${token_type}~ArcaneV4`,
                        expires_in: 14400,
                        expires_at: new Date(Date.now() + 14400 * 1000).toISOString(),
                        token_type: "bearer",
                        client_id: "ArcaneV4",
                        internal_client: true,
                        client_service: "fortnite"
                    });
                    console.log("Sent Reply for client credentials");
                }
                else {
                    return reply.status(404).send({
                        error: "arcane.errors.unsupported.grant_type",
                        error_description: "The grant type you requested is unsupported or not allowed",
                        code: 404
                    });
                }
            }
            catch (err) {
                console.error("ERROR:", err);
                return reply.status(500).send({
                    error: "SERVER ERROR"
                });
            }
        }));
        fastify.get('/account/api/oauth/verify', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const { authorization } = request.headers;
            reply.header('Content-Type', 'application/json');
            if (!authorization || !authorization.startsWith('bearer ')) {
                console.error("Authorization token is required");
                return reply.code(400).send({
                    error: 'arcane.errors.missing_token',
                    error_description: 'Authorization token is required'
                });
            }
            if (!jwt_secret) {
                return reply.status(403).send({
                    error: "arcane.errors.token.invalid",
                    error_description: "The token system had an error",
                    code: 403
                });
            }
            const token = authorization.replace("bearer ", "");
            const userToken = jsonwebtoken_1.default.verify(token.replace("eg1~", ""), jwt_secret);
            if (typeof userToken === "string" || !userToken) {
                return reply.status(403).send({
                    error: "arcane.errors.token.invalid",
                    error_description: "The token system had an error",
                    code: 403
                });
            }
            return reply.status(200).send({
                "access_token": token,
                "expires_in": 28800,
                "expires_at": "9999-12-02T01:12:01.100Z",
                "token_type": "bearer",
                "refresh_token": userToken.refresh_token,
                "refresh_expires": 86400,
                "refresh_expires_at": "9999-12-02T01:12:01.100Z",
                "account_id": userToken.accountId,
                "client_id": "ArcaneV4",
                "internal_client": true,
                "client_service": "fortnite",
                "displayName": userToken.username,
                "app": "fortnite",
                "in_app_id": userToken.accountId,
                "device_id": userToken.accountId
            });
        }));
        fastify.delete("/account/api/oauth/sessions/kill", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            return reply.status(200).send({
                status: "OK",
                code: 200
            });
        }));
        fastify.delete("/account/api/oauth/sessions/kill/:token", (request, reply) => __awaiter(this, void 0, void 0, function* () {
            return reply.status(200).send({
                status: "OK",
                code: 200
            });
        }));
    });
}
