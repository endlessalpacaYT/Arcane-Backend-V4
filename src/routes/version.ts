import { FastifyInstance } from 'fastify';

export async function versionRoutes(fastify: FastifyInstance) {
    fastify.get('/fortnite/api/v2/versioncheck', (request, reply) => {
        return reply.status(200).send({
            type: "NO_UPDATE"
        })
    })

    fastify.get('/fortnite/api/v2/versioncheck/:version', (request, reply) => {
        return reply.status(200).send({
            type: "NO_UPDATE"
        })
    })

    fastify.get("/fortnite/api/calendar/v1/timeline", (request, reply) => {
        return reply.status(200).send({
            channels: {
                "client-matchmaking": {
                    states: [],
                    cacheExpire: "9999-01-01T00:00:00.000Z"
                },
                "client-events": {
                    states: [{
                        validFrom: "0001-01-01T00:00:00.000Z",
                        activeEvents: [],
                        state: {
                            activeStorefronts: [],
                            eventNamedWeights: {},
                            seasonNumber: 3.5,
                            seasonTemplateId: `AthenaSeason:athenaseason12`,
                            matchXpBonusPoints: 0,
                            seasonBegin: "2020-01-01T00:00:00Z",
                            seasonEnd: "9999-01-01T00:00:00Z",
                            seasonDisplayedEnd: "9999-01-01T00:00:00Z",
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
        });
    });
}