import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`error connecting to mongoDB: ${error}`);
    process.exit(1);
  }
};

export default connectMongoDb;
