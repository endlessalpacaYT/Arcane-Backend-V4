import { FastifyInstance } from 'fastify';

export async function friendRoutes(fastify: FastifyInstance) {
    fastify.get('/friends/api/v1/:accountId/blocklist', (request, reply) => {
        return reply.status(200).send([])
    })
}