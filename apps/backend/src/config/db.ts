// apps/backend/src/config/db.ts
import mongoose, { ConnectOptions } from 'mongoose';

// Extended database interface with connection tracking
interface MagajicoDatabase extends typeof mongoose {
  isConnected?: number;
  connectionType?: 'primary' | 'replica' | 'local';
}

const db = mongoose as MagajicoDatabase;

export const connectDB = async (): Promise<void> => {
  // If already connected, return
  if (db.isConnected === 1) {
    console.log('✅ Already connected to database');
    console.log(`📊 Connection type: ${db.connectionType || 'unknown'}`);
    return;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');
    
    // Determine connection type
    if (MONGODB_URI.includes('mongodb+srv')) {
      db.connectionType = 'primary';
      console.log('📡 Using MongoDB Atlas (Primary)');
    } else if (MONGODB_URI.includes('replica')) {
      db.connectionType = 'replica';
      console.log('🔗 Using Replica Set');
    } else {
      db.connectionType = 'local';
      console.log('💻 Using Local MongoDB');
    }

    // MongoDB connection options with proper types
    const options: ConnectOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    };

    // Add server API settings for Atlas connections
    if (db.connectionType === 'primary') {
      options.serverApi = {
        version: '1' as const, // Fixed: Use literal '1' instead of string
        strict: true,
        deprecationErrors: true,
      };
    }

    // Add TLS certificate for production
    if (process.env.NODE_ENV === 'production' && process.env.TLS_CERT_PATH) {
      options.tlsCertificateKeyFile = process.env.TLS_CERT_PATH;
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI, options);

    db.isConnected = conn.connection.readyState;

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${getConnectionState(conn.connection.readyState)}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err: Error) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
      db.isConnected = 0;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 Mongoose connection closed due to app termination');
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    
    // Type-safe error handling
    if (err instanceof Error) {
      console.error('Error details:', err.message);
      console.error('Stack trace:', err.stack);
    } else {
      console.error('Unknown error:', err);
    }

    // In production, try fallback or retry logic
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Retrying connection in 5 seconds...');
      setTimeout(() => connectDB(), 5000);
    } else {
      throw err;
    }
  }
};

// Helper function to get human-readable connection state
function getConnectionState(state: number): string {
  const states: { [key: number]: string } = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    99: 'Uninitialized'
  };
  return states[state] || 'Unknown';
}

// Disconnect from database
export const disconnectDB = async (): Promise<void> => {
  try {
    if (db.isConnected === 1) {
      await mongoose.connection.close();
      db.isConnected = 0;
      console.log('✅ MongoDB disconnected successfully');
    }
  } catch (err) {
    console.error('❌ Error disconnecting from MongoDB:', err);
    if (err instanceof Error) {
      throw new Error(`Failed to disconnect: ${err.message}`);
    }
    throw err;
  }
};

// Get connection status
export const getDBStatus = () => {
  return {
    isConnected: db.isConnected === 1,
    connectionType: db.connectionType || 'unknown',
    readyState: mongoose.connection.readyState,
    readyStateText: getConnectionState(mongoose.connection.readyState),
    host: mongoose.connection.host || 'N/A',
    name: mongoose.connection.name || 'N/A'
  };
};

// Health check function
export const checkDBHealth = async (): Promise<boolean> => {
  try {
    if (db.isConnected !== 1) {
      return false;
    }
    
    // Ping the database
    await mongoose.connection.db.admin().ping();
    return true;
  } catch (err) {
    console.error('❌ Database health check failed:', err);
    return false;
  }
};

export default mongoose;