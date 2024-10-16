import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import profileman from "../utils/user/profileman";

import User from "../database/models/user";

import QueryProfile from "../operations/QueryProfile";

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
    
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/:operation', async (request: FastifyRequest<{ Params: operationParams, Querystring: profile }>, reply: FastifyReply) => {
        try {
            console.log(request.url);
            const { accountId, operation } = request.params;
            const { profileId, rvn } = request.query;

            switch (operation) {
                case "QueryProfile":
                    const queryProfile = await QueryProfile.QueryProfile(accountId, profileId, Number(rvn));
                    return reply.status(200).send({queryProfile})
                case "ClientQuestLogin":
                    return reply.status(200).send({
                        status: "OK",
                        code: 200
                    })
                case "SetMtxPlatform":
                    return reply.status(200).send({
                        status: "OK",
                        code: 200
                    }) 
                case "ClaimMfaEnabled":
                    return reply.status(200).send({
                        status: "OK",
                        code: 200
                    }) 
                default:
                    console.warn(`Operation ${operation} is not supported`);
                    return reply.status(400).send({
                        error: 'arcane.errors.operation.unknown',
                        error_description: `Operation ${operation} is not supported`,
                        code: 400
                    });
            }
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            })
        }
    })
}