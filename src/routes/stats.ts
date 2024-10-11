import { FastifyInstance } from 'fastify';

export async function statsRoutes(fastify: FastifyInstance) {
    fastify.get('/fortnite/api/statsv2/account/:accountId', (request, reply) => {
        return reply.status(200).send([])
    })
}