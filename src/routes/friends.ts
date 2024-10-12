import { FastifyInstance } from 'fastify';

export async function friendRoutes(fastify: FastifyInstance) {
    fastify.get('/friends/api/v1/:accountId/blocklist', (request, reply) => {
        return reply.status(200).send([])
    })

    fastify.get('/friends/api/public/blocklist/:accountId', (request, reply) => {
        return reply.status(200).send([])
    })

    fastify.get('/friends/api/v1/:accountId/summary', (request, reply) => {
        return reply.status(200).send([])
    })

    fastify.get('/friends/api/public/friends/:accountId', (request, reply) => {
        return reply.status(200).send([])
    })

    fastify.get('/friends/api/v1/:accountId/recent/fortnite', (request, reply) => {
        return reply.status(200).send([])
    })

    fastify.get('/friends/api/v1/:accountId/settings', (request, reply) => {
        return reply.status(200).send([])
    })
}