import { FastifyInstance } from 'fastify';

export async function legal(fastify: FastifyInstance) {
    const eulaData = [
        {
            id: "ArcaneV4",
            locale: "en",
            text: "End User License Agreement for ArcaneV4 - Version 1.0"
        },
    ];

    fastify.get("/eulatracking/api/shared/agreements/fn", (request, reply) => {
        reply.status(200).send(eulaData);
    });

    fastify.get("/eulatracking/api/public/agreements/fn/account/:accountId", (request, reply) => {
        reply.status(204).send();
    });
}