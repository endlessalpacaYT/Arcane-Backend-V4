import { FastifyInstance } from 'fastify';
import functions from '../utils/functions';

export async function contentRoutes(fastify: FastifyInstance) {
    fastify.get('/content/api/pages/fortnite-game', (request, reply) => {
        return reply.status(200).send(require("../responses/contentpages.json"));
    })

    fastify.get('/fortnite/api/game/v2/world/info', (request, reply) => {
        const memory = functions.GetVersionInfo(request);

        var theater: any = JSON.stringify(require("../responses/Campaign/worldstw.json"));
        var Season = "Season" + memory.season;

        try {
            if (memory.build >= 15.30) {
                theater = theater.replace(/\/Game\//ig, "\/SaveTheWorld\/");
                theater = theater.replace(/\"DataTable\'\/SaveTheWorld\//ig, "\"DataTable\'\/Game\/");
            }

            var date = new Date();
            var hour = date.getHours();

            if (memory.season >= 9) {
                date.setHours(23, 59, 59, 999);
            } else {
                if (hour < 6) {
                    date.setHours(5, 59, 59, 999);
                } else if (hour < 12) {
                    date.setHours(11, 59, 59, 999);
                } else if (hour < 18) {
                    date.setHours(17, 59, 59, 999);
                } else {
                    date.setHours(23, 59, 59, 999);
                }
            }

            const newdate = date.toISOString();

            theater = theater.replace(/2017-07-25T23:59:59.999Z/ig, newdate);
        } catch (err) { }

        theater = JSON.parse(theater)

        if (theater.hasOwnProperty("Seasonal")) {
            if (theater.Seasonal.hasOwnProperty(Season)) {
                theater.theaters = theater.theaters.concat(theater.Seasonal[Season].theaters);
                theater.missions = theater.missions.concat(theater.Seasonal[Season].missions);
                theater.missionAlerts = theater.missionAlerts.concat(theater.Seasonal[Season].missionAlerts);
            }
            delete theater.Seasonal;
        }

        reply.status(200).send(theater);
    })
}