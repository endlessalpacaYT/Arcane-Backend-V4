import { FastifyInstance } from 'fastify';

export async function waitingroom(fastify: FastifyInstance) {
    fastify.get('/waitingroom/api/waitingroom', (request, reply) => {
        reply.status(204).send();
    })

    fastify.get('/launcher-resources/waitingroom/*', (request, reply) => {
        reply.status(200).send({
            status: "OK",
            code: 200
        })
    })
}