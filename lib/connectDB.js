import mongoose from 'mongoose';

// Mongo URI validation moved inside connectDB to avoid top-level crashes


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  // Get the MongoDB URI from environment
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI || typeof MONGODB_URI !== 'string') {
    console.error('Missing or invalid MongoDB URI:', MONGODB_URI);
    throw new Error('Missing or invalid MongoDB URI environment variable.');
  }

  // For debugging only; redact in prod
  console.log('Connecting with MongoDB URI:', '[REDACTED]');

  if (!cached.promise) {
    // Connect to MongoDB
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'neonest',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
