import mongoose, { Error } from "mongoose";

mongoose.connection.on("error", (err: Error) => {
  console.log("Connection error:", err);
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB on", mongoose.connection.name);
});

mongoose
  .connect(process.env.DATABASE_URI as string)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

export default mongoose.connection;
