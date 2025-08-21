import { Sequelize, DataTypes } from 'sequelize';
import Oven from '@/model/oven.model.js';
import OvenTemperature from '@/model/oven_temperatures.model.js';

const sequelize: Sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/monitoring_system');

export default class SequelizeDB {
  constructor() {}

  private defineModel() {
    Oven.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        ovenType: {
          type: DataTypes.ENUM('mangan', 'bobin', 'bubuk'),
          allowNull: false,
        },
        ovenNo: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        tableName: 'oven',
        indexes: [
          {
            unique: true,
            fields: ['ovenType', 'ovenNo'],
          },
        ],
        sequelize,
      }
    );
    OvenTemperature.init(
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        ovenId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        temperature: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: 'oven_temperatures',
        sequelize,
      }
    );
  }

  private defineTableAssociation() {
    Oven.hasMany(OvenTemperature, {
      foreignKey: 'ovenId',
      as: 'temperatures',
    });
  }

  public async connectDB() {
    try {
      await sequelize.authenticate();
      console.log('Connection Database success');
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  public async syncDB() {
    try {
      this.defineModel();
      this.defineTableAssociation();
      await sequelize.sync({ alter: true });
    } catch (error) {
      console.error('Sync DB Error: ', error);
    }
  }
}
