import {
  Client,
  Collection,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
  ActivityType,
  GuildMember,
} from 'discord.js';
import { config } from '../config/env';
import { logger } from '../logging/logger';
import { ICommand, CommandContext } from './command.interface';

export class MusicBotClient extends Client {
  public commands: Collection<string, ICommand> = new Collection();
  public cooldowns: Collection<string, Collection<string, number>> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.registerCoreEvents();
  }

  public registerCommand(command: ICommand): void {
    this.commands.set(command.name, command);
    if (command.aliases) {
      for (const alias of command.aliases) {
        this.commands.set(alias, command);
      }
    }
  }

  private registerCoreEvents(): void {
    this.once('ready', async () => {
      logger.info(
        { user: this.user?.tag, guilds: this.guilds.cache.size },
        'Discord gateway authenticated successfully'
      );

      this.user?.setPresence({
        activities: [{ name: '🎵 /xtplay | SauraXT Music', type: ActivityType.Listening }],
        status: 'online',
      });
    });

    this.on('interactionCreate', async (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const baseName = interaction.commandName.startsWith('xt')
        ? interaction.commandName.slice(2)
        : interaction.commandName;

      const command = this.commands.get(interaction.commandName) || this.commands.get(baseName);
      if (!command) return;

      if (!interaction.guildId || !interaction.member) {
        await interaction.reply({
          content: '❌ Commands can only be used inside Discord servers.',
          ephemeral: true,
        });
        return;
      }

      const member = interaction.member as GuildMember;
      const voiceChannel = member.voice?.channel ?? null;

      if (command.voiceChannelRequired && !voiceChannel) {
        await interaction.reply({
          content: '❌ You must be connected to a voice channel to use this command!',
          ephemeral: true,
        });
        return;
      }

      const ctx: CommandContext = {
        interaction,
        guildId: interaction.guildId,
        userId: interaction.user.id,
        member,
        channel: interaction.channel!,
        voiceChannel,
      };

      const start = Date.now();
      try {
        await command.execute(ctx);
        const durationMs = Date.now() - start;
        logger.info(
          { command: command.name, guildId: ctx.guildId, userId: ctx.userId, durationMs },
          'Command executed successfully'
        );
      } catch (err: unknown) {
        const error = err as Error;
        logger.error(
          { command: command.name, guildId: ctx.guildId, userId: ctx.userId, err: error.message },
          'Command execution failed'
        );

        const replyContent = '❌ An unexpected error occurred while executing this command. Please try again.';
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply({ content: replyContent }).catch(() => {});
        } else {
          await interaction.reply({ content: replyContent, ephemeral: true }).catch(() => {});
        }
      }
    });
  }

  public async syncSlashCommands(): Promise<void> {
    const commandPayload: unknown[] = [];

    for (const cmd of this.commands.values()) {
      const data = cmd.data.toJSON();
      commandPayload.push(data);
      if (!data.name.startsWith('xt')) {
        commandPayload.push({ ...data, name: `xt${data.name}` });
      }
    }

    const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);
    logger.info({ count: commandPayload.length }, 'Synchronizing application slash commands with Discord');

    await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
      body: commandPayload,
    });

    logger.info('Slash command synchronization completed');
  }

  public async start(): Promise<void> {
    logger.info('Starting Discord Bot Client...');
    await this.login(config.BOT_TOKEN);
  }
}
