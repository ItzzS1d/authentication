import mongoose from "mongoose";

const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("error connecting to db", error);
  }
};

export default connectToMongoDB;
