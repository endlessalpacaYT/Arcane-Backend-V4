import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const athena = require("../responses/DefaultProfiles/athena.json")
const common_public = require("../responses/DefaultProfiles/common_public.json")
const common_core = require("../responses/DefaultProfiles/common_core.json")

export async function mcpRoutes(fastify: FastifyInstance) {
    interface AccountParams {
        accountId: string;
    }

    interface QueryProfile {
        profileId: string,
        rvn: number;
    }
    
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', (request: FastifyRequest<{ Params: AccountParams, Querystring: QueryProfile }>, reply: FastifyReply) => {
        if (request.query.profileId == "common_public") {
            return reply.status(200).send(common_public);
        } else if (request.query.profileId == "common_core") {
            return reply.status(200).send(common_core);
        } else {
            return reply.status(200).send({
                status: "OK",
                code: 200
            })
        }
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform', (request: FastifyRequest<{ Params: AccountParams, Querystring: QueryProfile }>, reply: FastifyReply) => {
        if (request.query.profileId == "common_core") {
            return reply.status(200).send(common_core);
        } else {
            return reply.status(200).send({
                status: "OK",
                code: 200
            })
        }
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClaimMfaEnabled', (request: FastifyRequest<{ Params: AccountParams, Querystring: QueryProfile }>, reply: FastifyReply) => {
        if (request.query.profileId == "common_core") {
            return reply.status(200).send(common_core);
        } else {
            return reply.status(200).send({
                status: "OK",
                code: 200
            })
        }
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', (request: FastifyRequest<{ Params: AccountParams, Querystring: QueryProfile }>, reply: FastifyReply) => {
        if (request.query.profileId == "athena") {
            return reply.status(200).send(athena);
        } else {
            return reply.status(200).send({
                status: "OK",
                code: 200
            })
        }
    })
}