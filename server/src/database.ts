import { Sequelize } from 'sequelize';
import path from 'path';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// 初始化数据库
export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}; 