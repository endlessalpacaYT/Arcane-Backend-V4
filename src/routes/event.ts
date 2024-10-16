import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

import Profile from "../database/models/profiles";
import profileman from "../utils/user/profileman";

export async function eventRoutes(fastify: FastifyInstance) {
    fastify.get('/api/v1/events/Fortnite/download/:accountId', (request, reply) => {
        return reply.status(200).send([])
    })

    interface AccountParams {
        accountId: string;
    }

    interface setSubgroup {
        subgroupName: string;
        subgroupValue: string;
    }

    // i swear man these route definitions are getting so long grr
    fastify.post('/fortnite/api/game/v2/events/v2/setSubgroup/:accountId',
        async (request: FastifyRequest<{ Params: AccountParams, Body: setSubgroup}>, reply: FastifyReply) => {
        try {
            const { accountId } = request.params;
            const { subgroupName, subgroupValue } = request.body;
            console.log(request.body);

            let profile = await Profile.findOne({ accountId: accountId });
            if (!profile) {
                profile = await profileman.createProfile(accountId);
            }

            if (subgroupName == "GeoIdentity") {
                profile.profiles.eventData.subGroups.GeoIdentity.subgroupValue = subgroupValue;
                profile.markModified('profiles.eventData.subGroups.GeoIdentity.subgroupValue');
                console.log("Changed GeoIdentity To: " + subgroupValue);
                await profile.save();
                return reply.status(200).send({
                    subgroupValue: profile.profiles.eventData.subGroups.GeoIdentity.subgroupValue
                })
            } else {
                return reply.status(404).send({
                    error: "arcane.errors.subgroup.not_found",
                    error_description: "The subgroup was not found!",
                    code: 404
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