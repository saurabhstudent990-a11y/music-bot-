const { Model } = require('sequelize');
const sequelize = require('./sequelize');

class BaseModel extends Model {
    static init(attributes, options = {}) {
        if (!sequelize.isSqliteAvailable) {
            this.rawAttributes = attributes || {};
            this.options = options || {};
            this._mockStore = new Map();
            return this;
        }
        return super.init(attributes, options);
    }

    static hasMany() {
        if (!sequelize.isSqliteAvailable) return this;
        return super.hasMany(...arguments);
    }

    static belongsTo() {
        if (!sequelize.isSqliteAvailable) return this;
        return super.belongsTo(...arguments);
    }

    static setupParentTouch(foreignKey, ParentModel, parentField = 'updatedAt') {
        if (!sequelize.isSqliteAvailable) return;
        const updateParent = async (instance) => {
            if (instance[foreignKey]) {
                await ParentModel.update(
                    { [parentField]: new Date() },
                    { where: { id: instance[foreignKey] } }
                );
            }
        };

        this.addHook('afterCreate', 'updateParentTimestamp', updateParent);
        this.addHook('afterUpdate', 'updateParentTimestamp', updateParent);
        this.addHook('afterDestroy', 'updateParentTimestamp', updateParent);
    }

    static async findOne(options = {}) {
        if (!sequelize.isSqliteAvailable) {
            const list = await this.findAll(options);
            return list[0] || null;
        }
        return super.findOne(options);
    }

    static async findAll(options = {}) {
        if (!sequelize.isSqliteAvailable) {
            if (!this._mockStore) this._mockStore = new Map();
            const all = Array.from(this._mockStore.values());
            if (options && options.where) {
                return all.filter(item => {
                    for (const [k, v] of Object.entries(options.where)) {
                        if (item[k] !== v) return false;
                    }
                    return true;
                });
            }
            return all;
        }
        return super.findAll(options);
    }

    static async create(values = {}) {
        if (!sequelize.isSqliteAvailable) {
            if (!this._mockStore) this._mockStore = new Map();
            const id = this._mockStore.size + 1;
            const instance = {
                id,
                ...values,
                createdAt: new Date(),
                updatedAt: new Date(),
                destroy: async () => {
                    if (this._mockStore) this._mockStore.delete(id);
                }
            };
            this._mockStore.set(id, instance);
            return instance;
        }
        return super.create(values);
    }

    static async count(options = {}) {
        if (!sequelize.isSqliteAvailable) {
            const items = await this.findAll(options);
            return items.length;
        }
        return super.count(options);
    }

    static async destroy(options = {}) {
        if (!sequelize.isSqliteAvailable) {
            if (!this._mockStore) this._mockStore = new Map();
            const items = await this.findAll(options);
            items.forEach(i => this._mockStore.delete(i.id));
            return items.length;
        }
        return super.destroy(options);
    }

    static CACHE_KEYS = [];
}

module.exports = BaseModel;

/*
 * Project: SauraXT Music
 * Author: SauraXT
 * Organization: SauraXT
 * GitHub: https://github.com/saurabhstudent990-a11y
 * License: MIT
 * © 2026 SauraXT. All rights reserved.
 */
