import mongoose, { Error } from "mongoose";

export async function connectMongoose() {
  try {
    mongoose.connection.on("error", (err: Error) => {
      console.error("Connection error:", err);
    });

    mongoose.connection.once("open", () => {
      console.log("Connected to MongoDB on", mongoose.connection.name);
    });

    await mongoose.connect(process.env.DATABASE_URI as string);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
