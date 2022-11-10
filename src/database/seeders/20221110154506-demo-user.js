'use strict';
const { make } = require('../../helpers/password.helper');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roleId = await queryInterface.bulkInsert('Rols', [{
      name: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
    const userId = await queryInterface.bulkInsert('Users', [{
      name: 'ospi89@hotmail.com',
      password: await make('1234'),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
    return queryInterface.bulkInsert('UserRoles', [{
      userId: userId,
      roleId: roleId,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete( 'RoleUser', null, {} );
     await queryInterface.bulkDelete( 'User', null, {} );
  }
};
