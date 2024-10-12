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
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("details")
        .setDescription("View your account details"),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ discordId: interaction.user.id });
                if (!user) {
                    const embed = new discord_js_2.EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("Failed To retrieve details")
                        .setDescription("Reason: You do not have an Account! to create one do /register");
                    yield interaction.reply({ embeds: [embed], ephemeral: true });
                    return;
                }
                const embed = new discord_js_2.EmbedBuilder()
                    .setColor("#a600ff")
                    .setTitle("Account Details")
                    .addFields({
                    name: "Created",
                    value: new Date(user.created).toLocaleDateString(),
                    inline: true,
                }, {
                    name: "Banned",
                    value: user.banned ? "🔴 Yes" : "🟢 No",
                    inline: true
                }, {
                    name: "Account ID",
                    value: `\`${user.accountId}\``,
                    inline: false
                }, {
                    name: "Username",
                    value: user.username,
                    inline: true
                }, {
                    name: "Email",
                    value: `||${user.email}||`,
                    inline: true
                });
                yield interaction.reply({ embeds: [embed], ephemeral: true });
            }
            catch (error) {
                console.error("Error executing details command:", error);
                yield interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });
    }
};
