import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
// import ICommand from '../command.interface/command.interface.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('p')
    .setDescription('Добавление трека')
    .addStringOption((option) => option
      .setName('query')
      .setDescription('name')
      .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) {
      return;
    }

    const channel = interaction.member.voice.channel;
    const query = interaction.options.getString('query');

    if (channel === null || query === null) {
      return;
    }

    await interaction.deferReply();
    await interaction.client.distube.play(channel, query);
    await interaction.editReply({ content: `В очередь пользователем добавлен новый трек` });
  }
}

export default command;
