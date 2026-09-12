import { config } from './config/env';
import { logger } from './logging/logger';
import { MusicBotClient } from './bot/client';
import { pingCommand } from './bot/commands/general/ping';
import { startApiServer } from './api/server';

async function bootstrap() {
  logger.info(
    { env: config.NODE_ENV, prefix: config.PREFIX },
    'Initializing SauraXT Music Platform...'
  );

  // 1. Start REST API Server (Health, Metrics)
  await startApiServer(config.API_PORT, config.API_HOST);

  // 2. Initialize Discord Client
  const client = new MusicBotClient();
  client.registerCommand(pingCommand);

  // 3. Graceful Shutdown handlers
  const handleShutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal. Gracefully stopping services...');
    client.destroy();
    process.exit(0);
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  // 4. Start Bot Gateway
  await client.start();
}

if (require.main === module) {
  bootstrap().catch((error) => {
    logger.fatal({ error }, 'Fatal error during platform bootstrap');
    process.exit(1);
  });
}

export { bootstrap };
