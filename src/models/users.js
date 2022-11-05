const { DataTypes, Error } = require('sequelize');
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

User.searchUser = async function (predicate) {
    try {
        const user = await User.findOne({ where: predicate})
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

User.updateUser = async function (hashId, user) {
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

module.exports = User;