import mongoose from "mongoose";
import "dotenv/config";

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI environment variable is not set");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB Connected");
};

export default connectDB;
