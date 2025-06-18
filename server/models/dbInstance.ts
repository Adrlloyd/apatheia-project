import { Sequelize } from 'sequelize';

const databaseName = process.env.DATABASE_NAME as string;
const databaseUser = process.env.DATABASE_USER as string;
const databasePassword = process.env.DATABASE_PASSWORD as string;
const databaseHost = process.env.DATABASE_HOST as string;

const sequelize = new Sequelize(
  databaseName,
  databaseUser,
  databasePassword,
  {
    host: databaseHost,
    dialect: 'postgres',
    logging: false,
  }
);

export default sequelize;
