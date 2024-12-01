import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import User from "../database/models/user";

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

    interface leaderboards {
        accountId: string;
        playlist: string;
    }

    fastify.get("/fortnite/api/game/v2/leaderboards/cohort/:accountId", async (request: FastifyRequest<{ Params: leaderboards, Querystring: leaderboards }>, reply) => {
        const user: any = User.findOne({ accountId: request.params.accountId });
        
        reply.status(200).send({
            "accountId": request.params.accountId,
            "cohortAccounts": [
                user.username,
                "ArcaneV4"
            ],
            "expiresAt": "9999-12-31T00:00:00.000Z",
            "playlist": request.query.playlist
        })
    })

    fastify.post("/fortnite/api/leaderboards/type/global/stat/:playlist/window/weekly", async (request: FastifyRequest<{ Params: leaderboards, Querystring: leaderboards }>, reply) => {
        reply.status(200).send([])
    })
}