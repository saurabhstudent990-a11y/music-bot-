const path = require('path');

let sequelize = null;
let isSqliteAvailable = false;

try {
    require('sqlite3');
    const { Sequelize } = require('sequelize');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, 'groove_music.db'),
        logging: false,
        define: {
            timestamps: true,
        }
    });
    isSqliteAvailable = true;
} catch (err) {
    console.warn(`[database] SQLite3 native binding not found for this Node version (${process.version}). Running database in fallback mode.`);
    let SequelizeClass = null;
    try {
        const seqModule = require('sequelize');
        SequelizeClass = seqModule.Sequelize || seqModule;
    } catch {}
    sequelize = {
        isSqliteAvailable: false,
        define: () => ({}),
        sync: async () => {},
        authenticate: async () => {},
        models: {},
        options: { dialect: 'sqlite' },
        Sequelize: SequelizeClass
    };
}

sequelize.isSqliteAvailable = isSqliteAvailable;
module.exports = sequelize;

/*
 * Project: SauraXT Music
 * Author: SauraXT
 * Organization: SauraXT
 * GitHub: https://github.com/saurabhstudent990-a11y
 * License: MIT
 * © 2026 SauraXT. All rights reserved.
 */
