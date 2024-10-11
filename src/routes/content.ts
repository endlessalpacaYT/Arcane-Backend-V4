import { FastifyInstance } from 'fastify';

export async function contentRoutes(fastify: FastifyInstance) {
    fastify.get('/content/api/pages/fortnite-game', (request, reply) => {
        return reply.status(200).send({
            status: "OK",
            code: 200
        })
    })
}