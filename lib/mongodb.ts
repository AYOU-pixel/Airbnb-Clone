import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log("✅ Already connected to MongoDB");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "airbnb",
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    isConnected = false;
    console.error("❌ Error connecting to MongoDB:", err);
    throw err; 
  }
}
