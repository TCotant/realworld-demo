"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "socialLinks", {
      type: Sequelize.JSONB,
      defaultValue: [],
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("Users", "socialLinks");
  },
};
