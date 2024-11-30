import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import profileman from "../utils/user/profileman";
import functions from "../utils/functions";

import User from "../database/models/user";

import QueryProfile from "../operations/QueryProfile";
import ClientQuestLogin from "../operations/ClientQuestLogin";
import SetHardcoreModifier from "../operations/SetHardcoreModifier";
import RefreshExpeditions from "../operations/RefreshExpeditions";
import SetCosmeticLockerBanner from "../operations/SetCosmeticLockerBanner";
import Fallback from '../operations/Fallback';

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

            const memory = functions.GetVersionInfo(request);
            const queryProfile = await QueryProfile.QueryProfile(accountId, profileId, Number(rvn), memory);
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

            const memory = functions.GetVersionInfo(request);
            const clientQuestLogin = await ClientQuestLogin.ClientQuestLogin(accountId, profileId, Number(rvn), memory);
            return reply.status(200).send({clientQuestLogin})
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            });
        }
    });

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetHardcoreModifier', async (request: FastifyRequest<{ Params: operationParams, Querystring: profile }>, reply: FastifyReply) => {
        try {
            const { accountId } = request.params;
            const { profileId, rvn } = request.query;

            const memory = functions.GetVersionInfo(request);
            const setHardcoreModifier = await SetHardcoreModifier.SetHardcoreModifier(accountId, profileId, Number(rvn), memory);
            return reply.status(200).send({setHardcoreModifier})
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            });
        }
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/RefreshExpeditions', async (request: FastifyRequest<{ Params: operationParams, Querystring: profile }>, reply: FastifyReply) => {
        try {
            const { accountId } = request.params;
            const { profileId, rvn } = request.query;

            const memory = functions.GetVersionInfo(request);
            const refreshExpeditions = await RefreshExpeditions.RefreshExpeditions(accountId, profileId, Number(rvn), memory);
            return reply.status(200).send({refreshExpeditions})
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            });
        }
    })

    interface SetCosmeticLockerBanner {
        lockerItem: string,
        bannerIconTemplateName: string,
        bannerColorTemplateName: string
    }

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerBanner', async (request: FastifyRequest<{ Params: operationParams, Querystring: profile, Body: SetCosmeticLockerBanner }>, reply: FastifyReply) => {
        try {
            const { accountId } = request.params;
            const { profileId, rvn } = request.query;
            console.log(request.query);
            console.log(request.body);

            const memory = functions.GetVersionInfo(request);
            const setCosmeticLockerBanner = await SetCosmeticLockerBanner.SetCosmeticLockerBanner(accountId, profileId, Number(rvn), request.body, memory);
            return reply.status(200).send({setCosmeticLockerBanner})
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            });
        }
    })
    
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/:operation', async (request: FastifyRequest<{ Params: operationParams, Querystring: profile }>, reply: FastifyReply) => {
        try {
            const { accountId, operation } = request.params;
            const { profileId, rvn } = request.query;

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