'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalAccessTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.User, {
        sourceKey: 'userId',
        foreignKey: 'id'
      });
    }
  }
  PersonalAccessTokens.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id"
      }
    },
    token: DataTypes.STRING,
    lastUsed: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'PersonalAccessTokens',
    timestamps: true
  });
  return PersonalAccessTokens;
};