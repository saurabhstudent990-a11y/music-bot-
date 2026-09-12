import { SlashCommandBuilder } from 'discord.js';
import { ICommand, CommandContext } from '../../command.interface';

export const pingCommand: ICommand = {
  name: 'ping',
  description: "Check the bot's gateway latency",
  category: 'general',
  data: new SlashCommandBuilder().setName('ping').setDescription("Check the bot's latency"),
  async execute(ctx: CommandContext): Promise<void> {
    const wsPing = ctx.interaction.client.ws.ping;
    await ctx.interaction.reply({
      content: `🏓 Pong! Gateway Latency: **${wsPing}ms**`,
      ephemeral: true,
    });
  },
};
