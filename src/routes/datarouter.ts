import { FastifyInstance } from 'fastify';

export async function dataRoutes(fastify: FastifyInstance) {
    fastify.post('/datarouter/api/v1/public/data', (request, reply) => {
        reply.code(200).send({
            status: "OK",
            code: 200
        })
    })
}