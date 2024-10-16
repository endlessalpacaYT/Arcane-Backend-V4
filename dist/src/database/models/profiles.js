"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProfilesSchema = new mongoose_1.default.Schema({
    created: { type: Date, required: true },
    accountId: { type: String, required: true, unique: true },
    profiles: { type: Object, required: true }
}, {
    collection: "profiles"
});
const model = mongoose_1.default.model('Profiles', ProfilesSchema);
exports.default = model;
