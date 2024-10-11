import { FastifyInstance } from 'fastify';

export async function cloudstorageRoutes(fastify: FastifyInstance) {
    fastify.get('/fortnite/api/cloudstorage/system', (request, reply) => {
        return reply.status(200).send({
            status: "OK",
            code: 200
        })
    })

    fastify.get('/fortnite/api/cloudstorage/user/:accountId', (request, reply) => {
        return reply.status(200).send({
            status: "OK",
            code: 200
        })
    })

    fastify.put('/fortnite/api/cloudstorage/user/:accountId/:fileName', (request, reply) => {
        return reply.status(200).send({
            status: "OK",
            code: 200
        })
    })
}