"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionRoutes = versionRoutes;
function versionRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get('/fortnite/api/v2/versioncheck', (request, reply) => {
            return reply.status(200).send({
                type: "NO_UPDATE"
            });
        });
        fastify.get('/fortnite/api/v2/versioncheck/:version', (request, reply) => {
            return reply.status(200).send({
                type: "NO_UPDATE"
            });
        });
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
    });
}
