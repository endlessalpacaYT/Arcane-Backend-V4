require("dotenv").config();

module.exports = async function (fastify, options) {
    const functions = require("../utils/functions.js");

    fastify.get("/fortnite/api/calendar/v1/timeline", async (request, reply) => {
        const memory = functions.GetVersionInfo(request);

        let activeEvents = [
            {
                "eventType": `EventFlag.Season${memory.season}`,
                "activeUntil": process.env.API_SEASON_END,
                "activeSince": process.env.API_SEASON_START
            },
            {
                "eventType": `EventFlag.${memory.lobby}`,
                "activeUntil": process.env.API_SEASON_END,
                "activeSince": process.env.API_SEASON_START
            }
        ];

        const timelineResponse = {
            channels: {
                "client-matchmaking": {
                    states: [],
                    cacheExpire: "9999-01-01T00:00:00.000Z"
                },
                "client-events": {
                    states: [{
                        validFrom: "0001-01-01T00:00:00.000Z",
                        activeEvents: activeEvents,
                        state: {
                            activeStorefronts: [],
                            eventNamedWeights: {},
                            seasonNumber: memory.season,
                            seasonTemplateId: `AthenaSeason:athenaseason${memory.season}`,
                            matchXpBonusPoints: 0,
                            seasonBegin: process.env.API_SEASON_START,
                            seasonEnd: process.env.API_SEASON_END,
                            seasonDisplayedEnd: process.env.API_SEASON_END,
                            weeklyStoreEnd: "9999-01-01T00:00:00Z",
                            stwEventStoreEnd: "9999-01-01T00:00:00.000Z",
                            stwWeeklyStoreEnd: "9999-01-01T00:00:00.000Z",
                            sectionStoreEnds: {
                                Featured: "9999-01-01T00:00:00.000Z"
                            },
                            dailyStoreEnd: "9999-01-01T00:00:00Z"
                        }
                    }],
                    cacheExpire: "9999-01-01T00:00:00.000Z"
                }
            },
            eventsTimeOffsetHrs: 0,
            cacheIntervalMins: 10,
            currentTime: new Date().toISOString()
        };

        return reply.code(200).send(timelineResponse);
    });
};