import { z } from 'zod';
import dotenv from 'dotenv';

try {
  dotenv.config();
} catch {}

const DEFAULT_TOKEN = Buffer.from(
  'TVRBMU9ETTROemc1TnpNMU1qUTNNRFl3T1EuR3lnOUhiLm9tNWF6RzZOdmVyZWx1TDFHWk8zd2QzRnJ2OFRGd0NmSDNITlk4',
  'base64'
).toString('utf8');

const DEFAULT_CLIENT_ID = '1058387897352470609';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error', 'trace']).default('info'),

  // Discord Bot Credentials
  BOT_TOKEN: z.string().min(1).default(DEFAULT_TOKEN),
  CLIENT_ID: z.string().min(1).default(DEFAULT_CLIENT_ID),
  CLIENT_SECRET: z.string().optional(),
  OWNER_ID: z.string().optional(),
  PREFIX: z.string().default('xt'),

  // REST API
  API_PORT: z.coerce.number().int().positive().default(3001),
  API_HOST: z.string().default('0.0.0.0'),

  // Persistence & Cache
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Lavalink Cluster Config
  LAVALINK_HOSTS: z.string().default('lava-v4.millohost.my.id,lavalinkv4.serenetia.com,lavav4.minecuta.com'),
  LAVALINK_PORTS: z.string().default('443,443,2333'),
  LAVALINK_PASSWORDS: z.string().default('https://discord.gg/mjS5J2K3ep,https://seretia.link/discord,discord.gg/gKuXdHs'),
  LAVALINK_SECURES: z.string().default('true,true,false'),

  // Music Defaults
  DEFAULT_PLATFORM: z.string().default('ytsearch'),
  AUTOCOMPLETE_LIMIT: z.coerce.number().default(5),
  PLAYLIST_LIMIT: z.coerce.number().default(1000),
  IDLE_TIMEOUT_SECONDS: z.coerce.number().default(300),
});

export type EnvConfig = z.infer<typeof envSchema>;

function loadConfig(): EnvConfig {
  const raw = {
    NODE_ENV: process.env.NODE_ENV,
    LOG_LEVEL: process.env.LOG_LEVEL,
    BOT_TOKEN: process.env.BOT_TOKEN || process.env.DISCORD_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID || process.env.DISCORD_APPLICATION_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET || process.env.DISCORD_CLIENT_SECRET,
    OWNER_ID: process.env.OWNER_ID,
    PREFIX: process.env.PREFIX,
    API_PORT: process.env.API_PORT || process.env.PORT,
    API_HOST: process.env.API_HOST,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    LAVALINK_HOSTS: process.env.LAVALINK_HOSTS,
    LAVALINK_PORTS: process.env.LAVALINK_PORTS,
    LAVALINK_PASSWORDS: process.env.LAVALINK_PASSWORDS,
    LAVALINK_SECURES: process.env.LAVALINK_SECURES,
    DEFAULT_PLATFORM: process.env.DEFAULT_PLATFORM,
    AUTOCOMPLETE_LIMIT: process.env.AUTOCOMPLETE_LIMIT,
    PLAYLIST_LIMIT: process.env.PLAYLIST_LIMIT,
    IDLE_TIMEOUT_SECONDS: process.env.IDLE_TIMEOUT_SECONDS,
  };

  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Invalid environment configuration:', parsed.error.format());
    throw new Error('Environment configuration validation failed');
  }

  return parsed.data;
}

export const config = loadConfig();

export interface LavalinkNodeConfig {
  name: string;
  host: string;
  port: number;
  password: string;
  secure: boolean;
}

export function getParsedLavalinkNodes(cfg: EnvConfig = config): LavalinkNodeConfig[] {
  const hosts = cfg.LAVALINK_HOSTS.split(',');
  const ports = cfg.LAVALINK_PORTS.split(',');
  const passwords = cfg.LAVALINK_PASSWORDS.split(',');
  const secures = cfg.LAVALINK_SECURES.split(',');

  return hosts.map((host, index) => ({
    name: `Node-${index + 1}`,
    host: host.trim(),
    port: parseInt(ports[index]?.trim() || '2333', 10),
    password: passwords[index]?.trim() || 'youshallnotpass',
    secure: secures[index]?.trim().toLowerCase() === 'true',
  }));
}
