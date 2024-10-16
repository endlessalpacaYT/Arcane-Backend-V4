import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import User from "../database/models/user";

export async function accountRoutes(fastify: FastifyInstance) {
    fastify.post('/fortnite/api/game/v2/tryPlayOnPlatform/account/:accountId', (request, reply) => {
        reply.header("Content-Type", "text/plain");
        return reply.status(200).send("true");
    });

    fastify.get('/account/api/public/account/:accountId/externalAuths', (request, reply) => {
        return reply.status(200).send([]);
    })

    fastify.get('/fortnite/api/game/v2/enabled_features', (request, reply) => {
        return reply.status(200).send([]);
    })

    fastify.get('/content-controls/:accountId', (request, reply) => {
        return reply.status(200).send([]);
    })

    interface AccountParams {
        accountId: string;
    }

    fastify.get('/account/api/public/account', async (request: FastifyRequest<{ Querystring: AccountParams }>, reply: FastifyReply) => {
        const { accountId } = request.query;

        const user = await User.findOne({ accountId: accountId });
        if (!user) {
            return reply.status(404).send({
                error: "arcane.errors.user.not_found",
                error_description: "The user was not found in the database",
                code: 404
            })
        }

        return reply.status(200).send({
            id: user.accountId,
            displayName: user.username,
            externalAuth: {}
        })
    });

    fastify.get("/account/api/public/account/:accountId", async (request: FastifyRequest<{ Params: AccountParams }>, reply: FastifyReply) => {
        const { accountId } = request.params;

        const user = await User.findOne({ accountId: accountId });
        if (!user) {
            return reply.status(404).send({
                error: "arcane.errors.user.not_found",
                error_description: "The user was not found in the database",
                code: 404
            })
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
    });

    fastify.post('/api/v1/user/setting', (request, reply) => {
        return reply.status(200).send({
            status: "OK",
            code: 200
        })
    })

    fastify.get('/socialban/api/public/v1/:accountId', (request, reply) => {
        return reply.status(200).send([])
    })

    fastify.get('/presence/api/v1/_/:accountId/settings/subscriptions', (request, reply) => {
        console.log(request.url);
        return reply.status(200).send([])
    })

    fastify.get('/fortnite/api/game/v2/privacy/account/:accountId', (request, reply) => {
        return reply.status(200).send([])
    })
}