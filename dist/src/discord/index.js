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
exports.default = startBot;
require('dotenv').config();
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent]
});
// TODO: add ban command, make sure it can only be used by admins.
// DEPRECATED USE UPCOMING WEB INTERFACE!
client.once('ready', () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
    registerCommands();
    setBotStatus();
});
function registerCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        const commands = [];
        const commandsPath = path_1.default.join(__dirname, 'commands');
        const commandFiles = fs_1.default.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
            const command = require(path_1.default.join(commandsPath, file));
            commands.push(command.data.toJSON());
        }
        const rest = new rest_1.REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
        try {
            yield rest.put(v9_1.Routes.applicationCommands(client.user.id), { body: commands });
            console.log('Successfully reloaded application (/) commands.');
        }
        catch (error) {
            console.error('Error reloading commands:', error);
        }
    });
}
function setBotStatus() {
    var _a;
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setPresence({
        activities: [
            {
                name: "ArcaneV4",
                type: discord_js_1.ActivityType.Watching
            }
        ],
        status: 'dnd'
    });
}
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    try {
        const command = require(`./commands/${interaction.commandName}.ts`);
        yield command.execute(interaction);
    }
    catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);
        yield interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
}));
function startBot() {
    client.login(process.env.BOT_TOKEN);
}
