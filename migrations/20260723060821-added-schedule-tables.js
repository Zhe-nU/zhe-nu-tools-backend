'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'bot',
        'createdAt',
        {
          type: Sequelize.DATE,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bot',
        'deletedAt',
        {
          type: Sequelize.DATE,
        },
        { transaction: t },
      );
      await queryInterface.addColumn(
        'bot',
        'updatedAt',
        {
          type: Sequelize.DATE,
        },
        { transaction: t },
      );

      await queryInterface.createTable(
        'schedule',
        {
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
          description: {
            type: Sequelize.STRING,
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
        },
        { transaction: t },
      );

      await queryInterface.sequelize.query(
        `
      insert into
          schedule ("userId", "name")
      select distinct
          b."userId",
          'Расписание'
      from bot b;`,
        { transaction: t },
      );

      await queryInterface.createTable(
        'schedule_item',
        {
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
        },
        { transaction: t },
      );

      await queryInterface.addConstraint('schedule_item', {
        fields: ['scheduleId', 'weekDay', 'startTime', 'endTime'],
        type: 'unique',
        name: 'schedule_day_time_unique',
        transaction: t,
      });

      await queryInterface.sequelize.query(
        `
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
      right join schedule s on sd.userId = s."userId"`,
        { transaction: t },
      );

      await queryInterface.createTable(
        'bot_schedule',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.literal('gen_random_uuid()'),
            primaryKey: true,
          },
          botId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'bot', key: 'id' },
          },
          scheduleId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'schedule',
              key: 'id',
            },
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
        },
        { transaction: t },
      );

      await queryInterface.sequelize.query(
        `
      insert into bot_schedule ("botId", "scheduleId")
      select distinct b.id, s.id
      from bot b left join schedule s on b."userId" = s."userId"`,
        { transaction: t },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('bot', 'createdAt', { transaction: t });
      await queryInterface.removeColumn('bot', 'deletedAt', { transaction: t });
      await queryInterface.removeColumn('bot', 'updatedAt', { transaction: t });

      await queryInterface.dropTable('bot_schedule', { transaction: t });

      await queryInterface.dropTable('schedule_item', { transaction: t });

      await queryInterface.dropTable('schedule', { transaction: t });
    });
  },
};
