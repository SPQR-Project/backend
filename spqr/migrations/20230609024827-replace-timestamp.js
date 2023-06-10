'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn('orders', 'created_at');
    await queryInterface.removeColumn('orders', 'updated_at');
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.addColumn('orders', 'created_at', {
      type: DataTypes.DATE,
      allowNull: false
    });
    await queryInterface.addColumn('YourTableName', 'column2', {
      type: DataTypes.DATE,
      allowNull: false
    });
  }
};
