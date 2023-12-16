#!/usr/bin/env node

import { Client, GatewayIntentBits, Events, Interaction, Routes, SlashCommandBuilder } from 'discord.js';
import getCollecion from './commands/index.js';
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { YtDlpPlugin } from '@distube/yt-dlp';
import 'dotenv/config';
import { REST } from '@discordjs/rest';

const token = process.env.TOKEN;
const appId = process.env.APP_ID;
const guildId = process.env.GUILD_ID;

if (!token || !appId || !guildId) {
  throw new Error('Не удалось получить доступ к .env');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.commands = await getCollecion();
client.distube = new DisTube(client, {
  leaveOnFinish: false,
  leaveOnStop: false,
  // emitNewSongOnly: true,
  // emitAddSongWhenCreatingQueue: false,
  // emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin(),
    new YtDlpPlugin(),
  ]
});

const rest = new REST({ version: '10' }).setToken(token);

client.once(Events.ClientReady, () => {
  console.log('Сервер запущен! Ура');
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    // логика по выбрасыванию ошибки, если комманда не найдена
    await interaction.reply(`${interaction.user.username}, ты реально тупой? Такой комманды не существует`)

  }

  try {
    command.execute(interaction);
  } catch (error) {
    // логика по выбрасыванию ошибки, если не удалось запустить комманду
    await interaction.reply('My bad! Не смог запустить комманду');
  }
});

const main = async () => {
  const commands: SlashCommandBuilder[] = client.commands.map((value) => value.data)
  try {
    console.log('Начато обновление комманд приложения (/)');
    await rest.put(Routes.applicationGuildCommands(appId, guildId), {
      body: commands,
    });
    client.login(token);
  } catch (err) {
    throw new Error('Не удалось обновить комманды');
  }
}

main();