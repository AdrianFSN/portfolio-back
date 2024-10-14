import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectMongoose } from "../lib/connectMongoose.js";
import readline from "readline";
import User from "../models/User.js";
import JobExample from "../models/JobExample.js";
import UserRoles from "../types/UserRoles.js";

dotenv.config();

function secureQuestion(text: string) {
  return new Promise((resolve) => {
    const readInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readInterface.question(text, (answer) => {
      readInterface.close();
      resolve(answer.toLowerCase() === "yes");
    });
  });
}

async function initUsers() {
  const delUsers = await User.deleteMany();
  console.log(`${delUsers.deletedCount} users have been deleted`);

  const candidatePassword = process.env.FIRST_USER_PASSWORD as string;
  const hashedPassword = await bcrypt.hash(candidatePassword, 10);

  const firstUser = {
    username: process.env.FIRST_USER_USERNAME as string,
    email: process.env.FIRST_USER_EMAIL as string,
    password: hashedPassword,
    role: UserRoles.ADMIN,
  };

  await User.create(firstUser);
  console.log("First user created successfully!");

  const insertedUsers = await User.find();

  console.log(`${insertedUsers.length} users created`);
}

async function initJobExamples() {
  const deleteJobExamples = await JobExample.deleteMany();
  console.log(
    `${deleteJobExamples.deletedCount} job examples have been deleted`
  );
}

async function main() {
  await connectMongoose();
  const deleteAll = await secureQuestion(
    "Are you sure you want to delete the whole data base? This action can't get undone (yes, NO)"
  );
  if (!deleteAll) {
    console.log("Database initialization aborted.");
    process.exit(0);
  } else {
    await initUsers();
    await initJobExamples();
    await mongoose.connection.close();
  }
}
main().catch((err) => {
  console.log(`There was an error initializing the DB: ${err}`);
  process.exit(1);
});
