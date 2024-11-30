import { FastifyInstance } from 'fastify';

export async function matchmaker(fastify: FastifyInstance) {
    fastify.get('/fortnite/api/matchmaking/session/findPlayer/:accountId', (request, reply) => {
        reply.status(204).send({});
    })
}