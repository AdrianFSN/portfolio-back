import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectMongoose } from "../lib/connectMongoose.js";
import readline from "readline";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
//import path from "path";
import fs from "fs";
import User from "../models/User.js";
import JobExample from "../models/JobExample.js";
import PicturesCollection from "../models/PicturesCollection.js";
import VideosCollection from "../models/VideosCollection.js";
import AudiosCollection from "../models/AudiosCollection.js";
import Versions from "../models/LocalizedJobExample.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    const newUser = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    };

    const createdUser = await User.create(newUser);

    // Verifying the saved user
    console.log(`User created successfully with id: ${createdUser._id}`);
  }

  const insertedUsers = await User.find();
  console.log(`${insertedUsers.length} users created`);
}

async function initJobExamples() {
  const delJobExamples = await JobExample.deleteMany();
  console.log(`${delJobExamples.deletedCount} job examples have been deleted`);

  const delVersions = await Versions.deleteMany();
  console.log(
    `${delVersions.deletedCount} versions collections have been deleted`
  );

  const existingPicturesCollection = await PicturesCollection.find();
  const existingVideosCollection = await VideosCollection.find();
  const existingAudiosCollection = await AudiosCollection.find();

  if (existingPicturesCollection) {
    const picturesToClean = path.join(__dirname, "../../uploads/image");
    deleteFilesInDirectory(picturesToClean);
    const thumbnailsToClean = path.join(
      __dirname,
      "../../uploads/image/thumbnails"
    );
    deleteFilesInDirectory(thumbnailsToClean);
    const delPicturesCollection = await PicturesCollection.deleteMany();
    console.log(
      `${delPicturesCollection.deletedCount} pictures collections have been deleted`
    );
  }
  if (existingVideosCollection) {
    const videosToClean = path.join(__dirname, "../../uploads/video");
    deleteFilesInDirectory(videosToClean);
    const delVideosCollection = await VideosCollection.deleteMany();
    console.log(
      `${delVideosCollection.deletedCount} videos collections have been deleted`
    );
  }
  if (existingAudiosCollection) {
    const audiosToClean = path.join(__dirname, "../../uploads/audio");
    deleteFilesInDirectory(audiosToClean);
    const delAudiosCollection = await AudiosCollection.deleteMany();
    console.log(
      `${delAudiosCollection.deletedCount} audios collections have been deleted`
    );
  }
}

async function main() {
  await connectMongoose();
  const deleteAll = await secureQuestion(
    "Are you sure you want to delete the whole data base? This action can not be undone (yes, NO)"
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

async function deleteFilesInDirectory(directoryPath: string) {
  try {
    const files = await fs.promises.readdir(directoryPath);
    const deletePromises = files.map(async (file) => {
      const filePath = path.join(directoryPath, file);
      try {
        const stats = await fs.promises.stat(filePath);
        if (stats.isFile()) {
          await fs.promises.unlink(filePath);
          console.log(`File deleted successfully: ${filePath}`);
        }
      } catch (err) {
        console.error("Error deleting file: ", err);
      }
    });

    await Promise.all(deletePromises);
  } catch (err) {
    console.error("Error reading directory: ", err);
  }
}
