import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import User from '../../database/models/user';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("details")
        .setDescription("View your account details"),

    async execute(interaction: ChatInputCommandInteraction) {
        try {

            const user = await User.findOne({ discordId: interaction.user.id })
            if (!user) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed To retrieve details")
                    .setDescription("Reason: You do not have an Account! to create one do /register");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
              }

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Account Details")
                .addFields({
                    name: "Created",
                    value: new Date(user.created).toLocaleDateString(),
                    inline: true,
                },
                {
                    name: "Banned",
                    value: user.banned ? "🔴 Yes" : "🟢 No",
                    inline: true
                },
                { 
                    name: "Account ID",
                    value: `\`${user.accountId}\``,
                    inline: false 
                },
                {
                     name: "Username", 
                     value: user.username, 
                     inline: true 
                },
                {
                     name: "Email", 
                     value: `||${user.email}||`, 
                     inline: true 
                }
            )

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error("Error executing details command:", error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
};