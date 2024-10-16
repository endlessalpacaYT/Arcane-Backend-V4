import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import profileman from "../utils/user/profileman";

import User from "../database/models/user";
import Profiles from "../database/models/profiles";

const athena = require("../responses/DefaultProfiles/athena.json")
const common_public = require("../responses/DefaultProfiles/common_public.json")
const common_core = require("../responses/DefaultProfiles/common_core.json")

export async function mcpRoutes(fastify: FastifyInstance) {
    interface operationParams {
        accountId: string;
        operation: string;
    }
    
    fastify.post('/fortnite/api/game/v2/profile/:accountID/client/:operation', async (request: FastifyRequest<{ Params: operationParams }>, reply: FastifyReply) => {
        try {
            return reply.status(200).send({
                status: "OK",
                code: 200
            })
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            })
        }
    })
}