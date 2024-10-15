import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import profileman from "../utils/user/profileman";

import User from "../database/models/user";
import Profiles from "../database/models/profiles";

const athena = require("../responses/DefaultProfiles/athena.json")
const common_public = require("../responses/DefaultProfiles/common_public.json")
const common_core = require("../responses/DefaultProfiles/common_core.json")

export async function mcpRoutes(fastify: FastifyInstance) {
    interface AccountParams {
        accountId: string;
    }

    interface QueryProfile {
        profileId: string;
        rvn: String;
    }
    
    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', async (request: FastifyRequest<{ Params: AccountParams, Querystring: QueryProfile }>, reply: FastifyReply) => {
        try {
            const { accountId } = request.params;
            let { rvn } = request.query;

            let profile = await Profiles.findOne({ accountId: accountId });
            if (!profile) {
                profile = await profileman.createProfile(accountId);
            }

            const rvnNumber = Number(rvn);
            
            if (request.query.profileId == "common_public") {
                profileman.updateProfileRvn(rvnNumber, "common_public", accountId)
                return reply.status(200).send(profile.profiles.common_public);
            } else if (request.query.profileId == "common_core") {
                profileman.updateProfileRvn(rvnNumber, "common_core", accountId)
                return reply.status(200).send(profile.profiles.common_core);
            } else if (request.query.profileId == "athena") {
                profileman.updateProfileRvn(rvnNumber, "athena", accountId)
                return reply.status(200).send(profile.profiles.athena);
            } else if (request.query.profileId == "creative") {
                profileman.updateProfileRvn(rvnNumber, "creative", accountId)
                return reply.status(200).send(profile.profiles.athena);
            } else {
                return reply.status(200).send({
                    status: "OK",
                    code: 200
                })
            }
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            })
        }
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform', async (request: FastifyRequest<{ Params: AccountParams, Querystring: QueryProfile }>, reply: FastifyReply) => {
        try {
            const { accountId } = request.params;
            let { rvn } = request.query;

            let profile = await Profiles.findOne({ accountId: accountId });
            if (!profile) {
                profile = await profileman.createProfile(accountId);
            }

            const rvnNumber = Number(rvn);
            
            if (request.query.profileId == "common_public") {
                profileman.updateProfileRvn(rvnNumber, "common_public", accountId)
                return reply.status(200).send(profile.profiles.common_public);
            } else if (request.query.profileId == "common_core") {
                profileman.updateProfileRvn(rvnNumber, "common_core", accountId)
                return reply.status(200).send(profile.profiles.common_core);
            } else if (request.query.profileId == "athena") {
                profileman.updateProfileRvn(rvnNumber, "athena", accountId)
                return reply.status(200).send(profile.profiles.athena);
            } else if (request.query.profileId == "creative") {
                profileman.updateProfileRvn(rvnNumber, "creative", accountId)
                return reply.status(200).send(profile.profiles.athena);
            } else {
                return reply.status(200).send({
                    status: "OK",
                    code: 200
                })
            }
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            })
        }
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClaimMfaEnabled', async (request: FastifyRequest<{ Params: AccountParams, Querystring: QueryProfile }>, reply: FastifyReply) => {
        try {
            const { accountId } = request.params;
            let { rvn } = request.query;

            let profile = await Profiles.findOne({ accountId: accountId });
            if (!profile) {
                profile = await profileman.createProfile(accountId);
            }

            const rvnNumber = Number(rvn);
            
            if (request.query.profileId == "common_public") {
                profileman.updateProfileRvn(rvnNumber, "common_public", accountId)
                return reply.status(200).send(profile.profiles.common_public);
            } else if (request.query.profileId == "common_core") {
                profileman.updateProfileRvn(rvnNumber, "common_core", accountId)
                return reply.status(200).send(profile.profiles.common_core);
            } else if (request.query.profileId == "athena") {
                profileman.updateProfileRvn(rvnNumber, "athena", accountId)
                return reply.status(200).send(profile.profiles.athena);
            } else if (request.query.profileId == "creative") {
                profileman.updateProfileRvn(rvnNumber, "creative", accountId)
                return reply.status(200).send(profile.profiles.athena);
            } else {
                return reply.status(200).send({
                    status: "OK",
                    code: 200
                })
            }
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            })
        }
    })

    fastify.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', async (request: FastifyRequest<{ Params: AccountParams, Querystring: QueryProfile }>, reply: FastifyReply) => {
        try {
            const { accountId } = request.params;
            let { rvn } = request.query;

            let profile = await Profiles.findOne({ accountId: accountId });
            if (!profile) {
                profile = await profileman.createProfile(accountId);
            }

            const rvnNumber = Number(rvn);
            
            if (request.query.profileId == "common_public") {
                profileman.updateProfileRvn(rvnNumber, "common_public", accountId)
                return reply.status(200).send(profile.profiles.common_public);
            } else if (request.query.profileId == "common_core") {
                profileman.updateProfileRvn(rvnNumber, "common_core", accountId)
                return reply.status(200).send(profile.profiles.common_core);
            } else if (request.query.profileId == "athena") {
                profileman.updateProfileRvn(rvnNumber, "athena", accountId)
                return reply.status(200).send(profile.profiles.athena);
            } else if (request.query.profileId == "creative") {
                profileman.updateProfileRvn(rvnNumber, "creative", accountId)
                return reply.status(200).send(profile.profiles.athena);
            } else {
                return reply.status(200).send({
                    status: "OK",
                    code: 200
                })
            }
        } catch (err) {
            console.error(err);
            return reply.status(500).send({
                error: "SERVER ERROR"
            })
        }
    })
}