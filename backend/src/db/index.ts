import { Sequelize, DataTypes } from 'sequelize';
import Oven from '@/model/oven.model.js';
import OvenTemperature from '@/model/oven_temperatures.model.js';
import OvenTime from '@/model/oven_time.model.js';
import OvenJudgement from '@/model/oven_jugdements.model.js';
import User from '@/model/user.model.js';
import JudgementDownload from '@/model/judgement_download.model.js';

const sequelize: Sequelize = new Sequelize("monitoring_system", "postgres", "postgres", {
  host: 'localhost',
  dialect: 'postgres',
  logging: false
});

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
        ovenTargetTemperature: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
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
          type: DataTypes.INTEGER,
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
    OvenTime.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        ovenId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        startRunning: {
          type: DataTypes.DATE,
          allowNull: true
        },
        startPeak: {
          type: DataTypes.DATE,
          allowNull: true
        },
        isAlreadyPeak: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        isStartingPeak: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        peakDuration: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        runningDuration: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        severityStatus: {
          type: DataTypes.STRING,
          allowNull: true
        },
        labelStatus: {
          type: DataTypes.STRING,
          allowNull: true
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        tableName: 'oven_time',
        sequelize,
      }
    )
    OvenJudgement.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ovenType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lot: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      channels: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      periode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      judgement: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      judged: {
        type: DataTypes.STRING,
        allowNull: true
      },
      buffers: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true
      },
      tempTarget: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
      },
      tempMaxStart: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      tempMaxEnd: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      tempMaxTime: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }
    }, {
      tableName: 'oven_jugdements',
      sequelize
    })
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      roles: {
        type: DataTypes.ENUM('admin', 'prods', 'qc'),
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'users',
      sequelize
    })

    JudgementDownload.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      judgementId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      downloadBy: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'judgement_downloads',
      sequelize
    })
  }

  private defineTableAssociation() {
    Oven.hasMany(OvenTemperature, {
      foreignKey: 'ovenId',
      as: 'temperatures',
    });

    OvenTemperature.belongsTo(Oven, {
      foreignKey: 'ovenId',
      as: 'oven'
    });

    Oven.hasOne(OvenTime, {
      foreignKey: 'ovenId',
      as: 'timer'
    });

    OvenTime.belongsTo(Oven, {
      foreignKey: 'ovenId',
      as: 'oven'
    })

    OvenJudgement.hasMany(JudgementDownload, {
      foreignKey: 'judgementId',
      as: 'downloads'
    })

    JudgementDownload.belongsTo(OvenJudgement, {
      foreignKey: 'judgementId',
      as: 'judgements'
    })
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