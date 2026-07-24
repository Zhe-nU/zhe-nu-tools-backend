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
    });

    await queryInterface.sequelize.query(`
      insert into
          schedule ("userId", "name")
      select distinct
          b."userId",
          'Расписание'
      from bot b;`);

    await queryInterface.createTable('schedule-item', {
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
      weekDays: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      timeRange: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
    });

    await queryInterface.sequelize.query(`
      with schedule_data as (
      select distinct
        b."userId" as userId,
        jsonb_array_elements(b.settings -> 'weekDayText') as schedule_item
      from
        bot b
      )

      insert into "schedule-item"  ("scheduleId", "weekDays", "timeRange") 
      select s.id, array(select jsonb_array_elements_text(sd.schedule_item -> 'days')), ARRAY['00:00', '23:59']
      from schedule_data sd
      right join schedule s on sd.userId = s."userId"`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('schedule-item');

    await queryInterface.dropTable('schedule');
  },
};
