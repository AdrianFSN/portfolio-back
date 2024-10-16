import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectMongoose } from "../lib/connectMongoose.js";
import readline from "readline";
import fs from "fs";
import User from "../models/User.js";
import JobExample from "../models/JobExample.js";

dotenv.config();

function replaceEnvVariables(data: string): string {
  return data.replace(/\$\{(.*?)\}/g, (_, key) => process.env[key] || "");
}

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

  const usersJson = fs.readFileSync("./src/initDB/initUsers.json", "utf-8");
  const usersData = JSON.parse(replaceEnvVariables(usersJson));

  for (const userData of usersData) {
    if (!userData.username || !userData.email || !userData.password) {
      console.log(`Skipping user creation due to missing data:`, userData);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
    };

    await User.create(newUser);
    console.log(
      `User created successfully! with pass: ${newUser.password} and ${userData.password}`
    );
  }

  const insertedUsers = await User.find();
  console.log(`${insertedUsers.length} users created`);
}

async function initJobExamples() {
  const deleteJobExamples = await JobExample.deleteMany();
  console.log(
    `${deleteJobExamples.deletedCount} job examples have been deleted`
  );

  const jobExamplesJson = fs.readFileSync(
    "./src/initDB/initJobExamples.json",
    "utf-8"
  );
  const jobExamplesData = JSON.parse(replaceEnvVariables(jobExamplesJson));

  for (const jobData of jobExamplesData) {
    const ownerEmail = jobData.owner;
    const jobOwner = await User.findOne({ email: ownerEmail });
    if (jobOwner) {
      const newJobExample = {
        ...jobData,
        owner: jobOwner._id,
      };
      await JobExample.create(newJobExample);
      console.log(
        `Job example created successfully for owner: ${jobOwner._id}`
      );
    } else {
      console.log(
        `No user found for email: ${ownerEmail}. Job example not created.`
      );
    }
  }

  const insertedJobExamples = await JobExample.find();
  console.log(`${insertedJobExamples.length} job examples created`);
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
