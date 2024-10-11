import { FastifyInstance } from 'fastify';

export async function feedbackRoutes(fastify: FastifyInstance) {
    fastify.put('/fortnite/api/feedback/log-snapshot/*', (request, reply) => {
        reply.status(200).send({
            status: "OK",
            code: 200
        })
    })
}