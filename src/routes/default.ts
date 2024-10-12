import { FastifyInstance } from 'fastify';

export async function defaultRoutes(fastify: FastifyInstance) {
    fastify.get('/', async (request, reply) => {
        return reply.status(200).send({
          backend: "ArcaneBackendV4"
        })
    });
}