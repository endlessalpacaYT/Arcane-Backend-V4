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
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const user_1 = __importDefault(require("../../database/models/user"));
require("dotenv").config();
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("unban")
        .setDescription("unban someone from ArcaneV4!")
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.BanMembers)
        .addStringOption(option => option.setName("username")
        .setDescription("Who do you want to unban?")
        .setRequired(true)),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield user_1.default.findOne({ username_lower: (_a = interaction.options.getString('username')) === null || _a === void 0 ? void 0 : _a.toLowerCase() });
                if (!user) {
                    const embed = new discord_js_2.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("Failed to unban user")
                        .setDescription("Reason: Couldn't find the user you were trying to unban.");
                    yield interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }
                else if (user.banned == false) {
                    const embed = new discord_js_2.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("Failed to unban user")
                        .setDescription("Reason: The user you were trying to unban isn't banned!");
                    yield interaction.reply({ embeds: [embed], ephemeral: true });
                }
                yield user.updateOne({ $set: { banned: false } });
                yield interaction.reply({ content: `Successfully unbanned ${user.username}!`, ephemeral: true });
            }
            catch (error) {
                console.error("Error executing the unban command:", error);
                yield interaction.editReply({ content: 'There was an error while executing this command!' });
            }
        });
    }
};
