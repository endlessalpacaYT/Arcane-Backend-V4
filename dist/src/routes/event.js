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
exports.eventRoutes = eventRoutes;
function eventRoutes(fastify) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get('/api/v1/events/Fortnite/download/:accountId', (request, reply) => {
            return reply.status(200).send([]);
        });
        // i swear man these route definitions are getting so long grr
        fastify.post('/fortnite/api/game/v2/events/v2/setSubgroup/:accountId', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { accountId } = request.params;
                const { subgroupName, subgroupValue } = request.body;
                console.log(request.body);
                return reply.status(200).send({
                    status: "OK",
                    code: 200
                });
            }
            catch (err) {
                console.error(err);
                return reply.status(500).send({
                    error: "SERVER ERROR"
                });
            }
        }));
    });
}
