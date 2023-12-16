import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

export default interface ICommand {
  data: SlashCommandBuilder,
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>,
}