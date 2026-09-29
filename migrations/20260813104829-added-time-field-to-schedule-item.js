'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('schedule_item', 'time', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {
        startTime: { hours: 0, minutes: 0 },
        endTime: { hours: 23, minutes: 59 },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('schedule_item', 'time');
  },
};
