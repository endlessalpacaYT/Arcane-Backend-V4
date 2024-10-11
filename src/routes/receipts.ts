import { FastifyInstance } from 'fastify';

export async function receiptRoutes(fastify: FastifyInstance) {
    fastify.get('/fortnite/api/receipts/v1/account/:accountId/receipts', (request, reply) => {
        return reply.status(200).send({
            status: "OK",
            code: 200
        })
    })
}