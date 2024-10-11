import { FastifyInstance } from 'fastify';

export async function partyRoutes(fastify: FastifyInstance) {
    fastify.get('/party/api/v1/Fortnite/user/:accountId', (request, reply) => {
        return reply.status(200).send({
            status: "OK",
            code: 200
        })
    })
}