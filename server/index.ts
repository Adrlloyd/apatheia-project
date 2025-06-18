import app from './app';
import connectDB from './models/db';
import { config } from './config';

let PORT = config.port;

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server running on port ${PORT} Λ`);
  } catch (error) {
    console.error('Failed to connect to DB:', error);
    process.exit(1);
  }
});