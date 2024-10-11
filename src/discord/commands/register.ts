import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import User from '../../database/models/user';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

module.exports = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Create An Account On ArcaneV4!")
        .addStringOption(option =>
            option.setName("username")
                .setDescription("What Do You Want Your Ingame Username To Be?")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("email")
                .setDescription("Your Email Which Will Be Used To Login.")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("password")
                .setDescription("Your Password Which Will Be Used To Login.")
                .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        const username = interaction.options.getString('username');
        const email = interaction.options.getString('email');
        const password = interaction.options.getString('password');
        const userId = interaction.user.id;

        function generateAccountId(): string {
            const uuid = uuidv4();
            const accountId = uuid.replace(/-/g, '').substring(0, 32);
            return accountId.toUpperCase();
        }

        if (!username || !email || !password) {
            return interaction.reply({ content: 'All fields are required!', ephemeral: true });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const existingUser = await User.findOne({ discordId: userId });

            if (existingUser) {
                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Failed To Create An Account!")
                    .setDescription("Reason: You already created an account!");

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            const newUser = new User({
                created: new Date(),
                banned: false,
                discordId: userId,
                accountId: generateAccountId(),
                username: username,
                username_lower: username.toLowerCase(),
                email: email,
                password: hashedPassword
            });

            await newUser.save();

            const embed = new EmbedBuilder()
                .setColor("#a600ff")
                .setTitle("Successfully Registered")
                .setDescription("Registered With The Username: " + username);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('Error registering user:', error);
            await interaction.reply({ content: 'There was an error registering your account. Please try again later.', ephemeral: true });
        }
    }
};