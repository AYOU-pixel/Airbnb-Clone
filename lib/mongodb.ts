import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "airbnb",
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }
}
