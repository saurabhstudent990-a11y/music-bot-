/**
 * Database Models Index
 * Initializes all models and sets up associations
 */

const sequelize = require('../sequelize');
const Favorite = require('./Favorite');
const Playlist = require('./Playlist');
const PlaylistTrack = require('./PlaylistTrack');
const NoPrefix = require('./NoPrefix');


const models = {
    Favorite,
    Playlist,
    PlaylistTrack,
    NoPrefix,
    sequelize
};


Object.values(models).forEach(model => {
    if (model && typeof model.associate === 'function') {
        try {
            model.associate(models);
        } catch (e) {
            console.warn('[database] Model association skipped:', e.message);
        }
    }
});

try {
    if (sequelize.isSqliteAvailable && typeof sequelize.sync === 'function') {
        sequelize.sync({ alter: false }).catch(() => {});
    }
} catch (e) {}

module.exports = models;

/*
 * Project: SauraXT Music
 * Author: SauraXT
 * Organization: SauraXT
 * GitHub: https://github.com/saurabhstudent990-a11y
 * License: MIT
 * © 2026 SauraXT. All rights reserved.
 */
