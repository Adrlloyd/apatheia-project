import { Sequelize } from 'sequelize';
import { config } from '../config/config';

const { name, user, password, host } = config.db;

const sequelize = new Sequelize(name, user, password, {
  host,
  dialect: 'postgres',
  logging: false,
});

export default sequelize;