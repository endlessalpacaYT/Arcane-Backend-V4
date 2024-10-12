import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import User from "../database/models/user";
import Token from "../database/models/token";

export async function authRoutes(fastify: FastifyInstance) {
    interface oauth {
        username: String;
        password: String;
        grant_type: String;
        token_type: String;
    }

    fastify.post('/account/api/oauth/token', async (request: FastifyRequest<{ Body: oauth }>, reply: FastifyReply) => {
        try {
            reply.header('Content-Type', 'application/json');
            const { grant_type } = request.body;

            console.log(request.body);

            if (grant_type == "password") {
                const { username, password, token_type } = request.body;
                if (!username || !password || !token_type) {
                    return reply.status(404).send({
                        error: "arcane.errors.common.not_found",
                        error_description: "username or password or token_type not found in body",
                        code: 404
                    })
                }

                const user = await User.findOne({ email: username });
                if (!user) {
                    return reply.status(404).send({
                        error: "arcane.errors.user.not_found",
                        error_description: "The user was not found in the database",
                        code: 404
                    })
                }

                return reply.status(200).send({
                    "access_token": `${token_type}~ArcaneV4`,
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
                    "displayName": user.username,
                    "app": "fortnite",
                    "in_app_id": "ArcaneV4",
                    "device_id": "ArcaneV4"
                })
            } else if (grant_type == "client_credentials") {
                const { token_type } = request.body;
                if (!token_type) {
                    return reply.status(404).send({
                        error: "arcane.errors.common.not_found",
                        error_description: "token_type not found in body",
                        code: 404
                    })
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
            } else {
                return reply.status(404).send({
                    error: "arcane.errors.unsupported.grant_type",
                    error_description: "The grant type you requested is unsupported or not allowed",
                    code: 404
                })
            }
        } catch (err) {
            console.error("ERROR:", err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            })
        }
    });

    fastify.get('/account/api/oauth/verify', async (request, reply) => {
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
        })
    });

    fastify.delete("/account/api/oauth/sessions/kill", async (request, reply) => {
        reply.header('Content-Type', 'application/json');
        reply.status(200).send({
            status: "OK",
            code: 200
        })
    });

    fastify.delete("/account/api/oauth/sessions/kill/:token", async (request, reply) => {
        reply.header('Content-Type', 'application/json');
        reply.status(200).send({
            status: "OK",
            code: 200
        })
    });
}