import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send an announcement')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The announcement message')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('roleid')
                .setDescription('The role ID to ping')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const message = interaction.options.getString('message')!;
        const roleId = interaction.options.getString('roleid')!;

        const role = interaction.guild?.roles.cache.get(roleId);
        if (!role) {
            return interaction.reply({ content: 'Role not found.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('📢 Announcement')
            .setDescription(`${role} ${message}`)
            .setTimestamp()
            .setFooter({ text: `Announcement by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() || '' });

        await interaction.reply({
            embeds: [embed],
        });
    },
};
