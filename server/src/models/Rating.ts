import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../database';

interface RatingAttributes {
  id?: number;
  timestamp: number;
  taskId: string;      // 新增
  userId: string;      // 新增
  confidenceScore: number;    // 回复置信度
  difficultyScore: number;    // 回复困难度
  timingScore: number;        // 提问时机
  contentScore: number;       // 问题内容
  interactionScore: number;   // 交互行为
  locationScore: number;      // 位置描述
  comment?: string;
  createdAt?: Date;
}

class Rating extends Model<RatingAttributes> implements RatingAttributes {
  public id!: number;
  public timestamp!: number;
  public taskId!: string;     // 新增
  public userId!: string;     // 新增
  public confidenceScore!: number;
  public difficultyScore!: number;
  public timingScore!: number;
  public contentScore!: number;
  public interactionScore!: number;
  public locationScore!: number;
  public comment!: string;
  public createdAt!: Date;
}

Rating.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  timestamp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  taskId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  confidenceScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: -1,
      max: 3
    }
  },
  difficultyScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: -1,
      max: 3
    }
  },
  timingScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: -1,
      max: 3
    }
  },
  contentScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: -1,
      max: 3
    }
  },
  interactionScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: -1,
      max: 3
    }
  },
  locationScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: -1,
      max: 3
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Rating',
  timestamps: true,
  updatedAt: false
});

export { Rating, RatingAttributes }; 