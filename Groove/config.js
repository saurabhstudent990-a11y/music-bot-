try { require('dotenv').config(); } catch {}

const DEFAULT_TOKEN = Buffer.from('TVRBMU9ETTROemc1TnpNMU1qUTNNRFl3T1EuR3lnOUhiLm9tNWF6RzZOdmVyZWx1TDFHWk8zd2QzRnJ2OFRGd0NmSDNITlk4', 'base64').toString('utf8');
const DEFAULT_CLIENT_ID = '1058387897352470609';

module.exports = {
    BOT_TOKEN: process.env.BOT_TOKEN || process.env.DISCORD_TOKEN || DEFAULT_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID || process.env.DISCORD_APPLICATION_ID || DEFAULT_CLIENT_ID,
    OWNER_ID: process.env.OWNER_ID || '',
    PREFIX: process.env.PREFIX || 'xt',


    LAVALINK: {
        HOSTS: process.env.LAVALINK_HOSTS || 'lava-v4.millohost.my.id,lavalinkv4.serenetia.com,lavav4.minecuta.com',
        PORTS: process.env.LAVALINK_PORTS || '443,443,2333',
        PASSWORDS: process.env.LAVALINK_PASSWORDS || 'https://discord.gg/mjS5J2K3ep,https://seretia.link/discord,discord.gg/gKuXdHs',
        SECURES: process.env.LAVALINK_SECURES || 'true,true,false'
    },


    MUSIC: {
        DEFAULT_PLATFORM: process.env.DEFAULT_PLATFORM || 'ytsearch',
        AUTOCOMPLETE_LIMIT: 5,
        PLAYLIST_LIMIT: 1000,
        ARTWORK_STYLE: 'MusicCard' // 'Banner' for MediaGallery or 'MusicCard' for custom image card
    },

    GENIUS: {
        API_KEY: process.env.GENIUS_API_KEY || ''
    }
};

/*
 * Project: SauraXT Music
 * Author: SauraXT
 * License: MIT
 * © 2026 SauraXT Music. All rights reserved.
 */