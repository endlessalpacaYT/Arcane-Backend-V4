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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = eventRoutes;
const profiles_1 = __importDefault(require("../database/models/profiles"));
const profileman_1 = __importDefault(require("../utils/user/profileman"));
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
                let profile = yield profiles_1.default.findOne({ accountId: accountId });
                if (!profile) {
                    profile = yield profileman_1.default.createProfile(accountId);
                }
                if (subgroupName == "GeoIdentity") {
                    profile.profiles.eventData.subGroups.GeoIdentity.subgroupValue = subgroupValue;
                    profile.markModified('profiles.eventData.subGroups.GeoIdentity.subgroupValue');
                    console.log("Changed GeoIdentity To: " + subgroupValue);
                    yield profile.save();
                    return reply.status(200).send({
                        subgroupValue: profile.profiles.eventData.subGroups.GeoIdentity.subgroupValue
                    });
                }
                else {
                    return reply.status(404).send({
                        error: "arcane.errors.subgroup.not_found",
                        error_description: "The subgroup was not found!",
                        code: 404
                    });
                }
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
