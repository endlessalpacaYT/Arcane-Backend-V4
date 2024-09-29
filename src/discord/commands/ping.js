const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check if the backend is up!"),

    async execute(interaction) {
        try {
            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Pong!")
                .setDescription("The Backend Is Online!");

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("Error executing ping command:", error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};
