import { FastifyInstance } from 'fastify';

export async function eventRoutes(fastify: FastifyInstance) {
    fastify.get('/api/v1/events/Fortnite/download/:accountId', (request, reply) => {
        return reply.status(200).send([])
    })
}