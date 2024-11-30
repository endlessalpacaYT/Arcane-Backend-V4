import { FastifyInstance } from 'fastify';

export async function contentRoutes(fastify: FastifyInstance) {
    fastify.get('/content/api/pages/fortnite-game', (request, reply) => {
        return reply.status(200).send({
            status: "OK",
            code: 200
        })
    })

    fastify.get('/fortnite/api/game/v2/world/info', (request, reply) => {
        reply.status(200).send({});
    })
}