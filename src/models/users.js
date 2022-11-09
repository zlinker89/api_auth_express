const { DataTypes, Error, Op } = require('sequelize');
const db = require('../configuration/db');

const User = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    'estado': {
        type: DataTypes.ENUM('Activo', 'Inactivo', 'Eliminado'),
        defaultValue: 'Activo'
    },
    'hashId': {
        type: DataTypes.STRING()
    }
},
    { timestamps: true }
);

User.getPaginated = async function (page, size, estados, filter = null) {
    let users = [];
    try {
        let where = {
            estado: {
                [Op.in]: estados
            }
        };
        if (filter) {
            where = {
                name: { [Op.like]: `%${filter.toLowerCase()}%` },
                [Op.and]: {
                    estado: {
                        [Op.in]: estados
                    }
                }
            };
        }
        users = await User.findAndCountAll({
            offset: db.literal(page * size),
            limit: db.literal(size),
            where: where,
            order: [db.literal('name')]
        });
    } catch (error) {
        throw new Error(error);
    }
    return users;
}

User.searchUser = async function (predicate) {
    try {
        const user = await User.findOne({ where: predicate })
        return user;
    } catch (error) {
        throw new Error(error);
    }
}

User.storeUser = async function (user) {
    // transaction start
    const t = await db.transaction();
    try {
        const userCreated = await User.create(user, { transaction: t })
        await t.commit();
        return userCreated;
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

User.updateUser = async function (predicate, data) {
    // transaction start
    const t = await db.transaction();
    try {
        await User.update(data, {
            where: predicate
        }, { transaction: t })
        await t.commit();
        return await User.searchUser(predicate);
    } catch (error) {
        await t.rollback();
        throw new Error(error);
    }
}

module.exports = User;