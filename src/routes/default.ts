import { FastifyInstance } from 'fastify';

export async function defaultRoutes(fastify: FastifyInstance) {
    fastify.all('/', async (request, reply) => {
        return reply.status(200).send({
          backend: "ArcaneBackendV4"
        })
    });
}