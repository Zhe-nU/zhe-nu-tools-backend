'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'bot',
        'avitoUserId',
        {
          type: Sequelize.UUID,
          references: {
            model: 'avito_user',
            key: 'id',
          },
        },
        { transaction: t },
      );

      await queryInterface.sequelize.query(
        `
        with avitoUser as (
        select distinct on (u.id) b.id as botId, u.id as userId, au.id as avitoUserId
        from avito_user au
        join "user" u on u.id = au."userId"
        join "bot" b on b."userId" = u.id
        order by u.id, b."createdAt" asc
        )
        update "bot" b set "avitoUserId" = au.avitoUserId
        from avitoUser au
        where b.id = au.botId`,
        { transaction: t },
      );

      await queryInterface.sequelize.query(
        `
        with bots_batch as (
        select b.id as id
        from bot b
        where b."avitoUserId" is null
        ),
        del_bot_schedules as (
        delete from bot_schedule bs using bots_batch bb where bs."botId" = bb.id
        ),
        del_bots as (
        delete from "bot" b using bots_batch bb where b.id = bb.id returning b.id
        )
        select count(*) from del_bots`,
        { transaction: t },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('bot', 'avitoUserId');
  },
};
