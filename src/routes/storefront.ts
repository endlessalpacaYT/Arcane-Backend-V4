import { FastifyInstance } from 'fastify';

const keychain = require("../responses/keychain.json")

export async function storefrontRoutes(fastify: FastifyInstance) {
    fastify.get('/fortnite/api/storefront/v2/keychain', (request, reply) => {
        return reply.status(200).send(keychain);
    })
}