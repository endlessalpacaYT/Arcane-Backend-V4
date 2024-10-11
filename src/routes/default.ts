import { FastifyInstance } from 'fastify';

export async function defaultRoutes(fastify: FastifyInstance) {
    fastify.get('/', async (request, reply) => {
        return {
          backend: "ArcaneBackendV4"
        };
    });
}