import { FastifyInstance } from 'fastify';

export async function versionRoutes(fastify: FastifyInstance) {
    fastify.get('/fortnite/api/v2/versioncheck', (request, reply) => {
        return reply.status(200).send({
            type: "NO_UPDATE"
        })
    })

    fastify.get('/fortnite/api/v2/versioncheck/:version', (request, reply) => {
        return reply.status(200).send({
            type: "NO_UPDATE"
        })
    })
}