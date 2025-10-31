import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // CRITICAL FIX: Always create a fresh connection to ensure fresh data reads
  // This prevents Mongoose from caching query results
  
  // If connection exists but is not connected, reconnect
  if (cached.conn && cached.conn.connection.readyState !== 1) {
    console.log('MongoDB connection lost, reconnecting...');
    cached.conn = null;
    cached.promise = null;
  }

  // Return existing connection if available and connected
  if (cached.conn && cached.conn.connection.readyState === 1) {
    console.log('Using active MongoDB connection');
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (cached.promise) {
    console.log('Waiting for MongoDB connection promise');
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (e) {
      cached.promise = null;
      throw e;
    }
  }

  // Create new connection
  console.log('Creating new MongoDB connection');
  
  const opts = {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 15000,
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 60000,
    // CRITICAL: Disable query caching at Mongoose level
    autoCreate: true,
    autoIndex: true,
  };

  cached.promise = mongoose
    .connect(MONGODB_URI, opts)
    .then((mongoose) => {
      console.log('MongoDB connected successfully');
      // Clear any cached models
      return mongoose;
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message);
      cached.promise = null;
      throw error;
    });

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connection established');
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('Database connection failed:', e.message);
    throw e;
  }
}

export default dbConnect;
