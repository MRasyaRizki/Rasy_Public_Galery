// lib/mongodb.ts
import mongoose from 'mongoose';

const connectMongo = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }
    // Opsi default Mongoose saat ini sudah cukup
    await mongoose.connect(process.env.MONGODB_URI); 
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Di lingkungan produksi, Anda mungkin ingin melakukan throw error
  }
};

export default connectMongo;