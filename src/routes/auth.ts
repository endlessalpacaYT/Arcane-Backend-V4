import { FastifyInstance } from 'fastify';

export async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/account/api/oauth/token', async (request, reply) => {
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