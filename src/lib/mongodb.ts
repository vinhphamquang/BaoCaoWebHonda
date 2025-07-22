import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Extend global type for mongoose caching
declare global {
  let mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Cấu hình đơn giản cho MongoDB Atlas
    const opts = {
      bufferCommands: false,
    };

    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log('URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas successfully');
      console.log('Database:', mongoose.connection.name);
      console.log('Host:', mongoose.connection.host);
      
      // Event listeners for connection monitoring
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB Atlas connection error:', error);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️ MongoDB Atlas disconnected');
      });
      
      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB Atlas reconnected');
      });

      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Failed to connect to MongoDB Atlas:', e);
    throw e;
  }

  return cached.conn;
}

// Health check function for MongoDB Atlas
export async function checkDBHealth() {
  try {
    const connection = await connectDB();
    const startTime = Date.now();
    
    // Simple ping to check connection
    await connection.connection.db.admin().ping();
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'connected',
      responseTime,
      readyState: connection.connection.readyState,
      host: connection.connection.host,
      name: connection.connection.name,
    };
  } catch (error) {
    return {
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default connectDB;
