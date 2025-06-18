import sequelize from './dbInstance';

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB! 🐘');
  } catch (error) {
    console.log(`Error connecting to DB: ${String(error)}`);
    process.exit(1);
  }
};

export default connectDB;