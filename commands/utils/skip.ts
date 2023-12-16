import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

const command = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Пропуск текущего трека'),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) {
      return;
    }

    const queue = interaction.client.distube.getQueue(interaction);

    if (!queue) {
      await interaction.reply('В очереди нет треков');
      return;
    }

    if (queue.songs.length === 1) {
      await queue.stop();
      await interaction.reply('Последний в очереди трек пропущен. Очередь удалена')
      return;
    }

    await interaction.client.distube.skip(interaction);
    await interaction.reply('Текущий трек пропущен')
  }
}

export default command;