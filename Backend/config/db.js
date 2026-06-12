const mongoose = require('mongoose');

const connectDB = async () => {
  // Set up connection event listeners (The Monitoring System)
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB connection lost. Mongoose will attempt to auto-reconnect...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🟢 MongoDB successfully reconnected! The self-healing loop worked.');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  try {
    // Initial connection with auto-reconnect settings
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Time to wait for a connection before failing
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    console.log(`🟢 MongoDB Initially Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`🚨 Fatal error connecting to MongoDB on startup: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
