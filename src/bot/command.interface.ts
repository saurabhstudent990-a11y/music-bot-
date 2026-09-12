import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  TextBasedChannel,
  VoiceBasedChannel,
  GuildMember,
} from 'discord.js';

export interface CommandContext {
  interaction: ChatInputCommandInteraction;
  guildId: string;
  userId: string;
  member: GuildMember;
  channel: TextBasedChannel;
  voiceChannel: VoiceBasedChannel | null;
}

export interface ICommand {
  name: string;
  description: string;
  category: 'music' | 'admin' | 'general';
  aliases?: string[];
  cooldownSeconds?: number;
  voiceChannelRequired?: boolean;
  djRequired?: boolean;
  data:
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
  execute(ctx: CommandContext): Promise<void>;
}
