'use strict';
const {
  Op,
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Rol, {
        through: models.UserRole,
        foreignKey: "userId",
        otherKey: "roleId"
      });
    }
  }
  User.init({
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
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true
  });

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
        offset: sequelize.literal(page * size),
        limit: sequelize.literal(size),
        where: where,
        order: [sequelize.literal('name')]
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
    const t = await sequelize.transaction();
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
    const t = await sequelize.transaction();
    try {
      await User.update(data, {
        where: predicate
      }, { transaction: t })
      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw new Error(error);
    }
    return false;
  }


  return User;
};