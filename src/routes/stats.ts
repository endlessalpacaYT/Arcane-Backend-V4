import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function statsRoutes(fastify: FastifyInstance) {
    interface stats {
        accountId: string
    }

    fastify.get("/fortnite/api/statsv2/account/:accountId", (request: FastifyRequest<{ Params: stats }>, reply: FastifyReply) => {
        reply.status(200).send({
            "startTime": 0,
            "endTime": 0,
            "stats": {},
            "accountId": request.params.accountId
        });
    });
    
    fastify.get("/statsproxy/api/statsv2/account/:accountId", (request: FastifyRequest<{ Params: stats }>, reply: FastifyReply) => {
        reply.status(200).send({
            "startTime": 0,
            "endTime": 0,
            "stats": {},
            "accountId": request.params.accountId
        });
    });
    
    fastify.get("/fortnite/api/stats/accountId/:accountId/bulk/window/alltime", (request: FastifyRequest<{ Params: stats }>, reply: FastifyReply) => {
        reply.status(200).send({
            "startTime": 0,
            "endTime": 0,
            "stats": {},
            "accountId": request.params.accountId
        });
    });
}