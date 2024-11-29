import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import profileman from "../utils/user/profileman";

import User from "../database/models/user";

import Fallback from '../operations/Fallback';
import QueryProfile from "../operations/QueryProfile";
import ClientQuestLogin from "../operations/ClientQuestLogin";

const athena = require("../responses/DefaultProfiles/athena.json")
const common_public = require("../responses/DefaultProfiles/common_public.json")
const common_core = require("../responses/DefaultProfiles/common_core.json")

export async function mcpRoutes(fastify: FastifyInstance) {
    interface operationParams {
        accountId: string;
        operation: string;
    }

    interface profile {
        profileId: string;
        rvn: string;
    }

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', async (request: FastifyRequest<{ Params: operationParams, Querystring: profile }>, reply: FastifyReply) => {
        try {
            const { accountId } = request.params;
            const { profileId, rvn } = request.query;
            console.log(request.body);

            const queryProfile = await QueryProfile.QueryProfile(accountId, profileId, Number(rvn));
            return reply.status(200).send(queryProfile);
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            });
        }
    });

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', async (request: FastifyRequest<{ Params: operationParams, Querystring: profile }>, reply: FastifyReply) => {
        try {
            const { accountId } = request.params;
            const { profileId, rvn } = request.query;

            const clientQuestLogin = await ClientQuestLogin.ClientQuestLogin(accountId, profileId, Number(rvn));
            return reply.status(200).send({clientQuestLogin})
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            });
        }
    });
    
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/:operation', async (request: FastifyRequest<{ Params: operationParams, Querystring: profile }>, reply: FastifyReply) => {
        try {
            const { accountId, operation } = request.params;
            const { profileId, rvn } = request.query;
            console.log(request.body);

            console.warn(`Operation ${operation} is not supported`);
            const fallback = await Fallback.Fallback(accountId, profileId, Number(rvn));
            return reply.status(200).send({fallback})
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            })
        }
    })
}