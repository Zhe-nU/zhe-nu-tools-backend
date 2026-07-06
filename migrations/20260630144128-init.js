'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('avito_user', {
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

      avitoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      profileUrl: {
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

    await queryInterface.createTable('avito_session', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
      },

      avitoUserId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'avito_user',
          key: 'id',
        },
      },

      accessToken: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      expiresIn: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      refreshToken: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      scope: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      tokenType: {
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

    await queryInterface.createTable('bot', {
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

      settings: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          answerOnFirstMessage: true,
          chatTypes: [],
          isActive: false,
          weekDayText: [],
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('avito_user');
    await queryInterface.dropTable('avito_session');
    await queryInterface.dropTable('bot');
  },
};
