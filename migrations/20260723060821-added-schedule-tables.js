'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('schedule', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },

      deletedAt: {
        type: Sequelize.DATE,
      },

      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.sequelize.query(`
      insert into
          schedule ("userId", "name")
      select distinct
          b."userId",
          'Расписание'
      from bot b;`);

    await queryInterface.createTable('schedule_item', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },
      scheduleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'schedule',
          key: 'id',
        },
      },
      weekDay: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },

      deletedAt: {
        type: Sequelize.DATE,
      },

      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('schedule_item', {
      fields: ['scheduleId', 'weekDay', 'startTime', 'endTime'],
      type: 'unique',
      name: 'schedule_day_time_unique',
    });

    await queryInterface.sequelize.query(`
      with schedule_data as (
      select distinct
        b."userId" as userId,
        jsonb_array_elements(b.settings -> 'weekDayText') as schedule_item
      from
        bot b
      )

      insert into "schedule_item"  ("scheduleId", "weekDay", "startTime", "endTime", "text") 
      select s.id, jsonb_array_elements_text(sd.schedule_item -> 'days'), '00:00', '23:59', sd.schedule_item -> 'text'
      from schedule_data sd
      right join schedule s on sd.userId = s."userId"`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('schedule_item');

    await queryInterface.dropTable('schedule');
  },
};
