import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

export const connectDB = async (): Promise<void> => {
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected successfully');
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
