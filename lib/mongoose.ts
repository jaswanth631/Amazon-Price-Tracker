import mongoose from 'mongoose';

let isConnected = false;// Variable to track the connection status

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  console.log('[DB] Attempting to connect...');
  if(!process.env.MONGODB_URI) {
    console.log('[DB] MONGODB_URI is not defined');
    return;
  }

  if(isConnected) {
    console.log('[DB] Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('[DB] MongoDB Connected');
  } catch (error) {
    console.log('[DB] Connection error:', error);
  }
}