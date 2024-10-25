import mongoose from "mongoose";
import fs from "fs-extra";
import path from "path";

export default async function deleteFilesFromCollection(
  filesFieldsList: string[],
  filesCollection: mongoose.Document,
  filesPath: string,
  thumbnailPath?: string
) {
  const filesToDelete = filesFieldsList
    .map((field) => filesCollection[field as keyof typeof filesCollection])
    .filter((value) => typeof value === "string") as string[];

  await Promise.all(
    filesToDelete.map(async (file: string) => {
      const filePath = path.join(filesPath, file);

      try {
        await fs.remove(filePath);
        console.log("File deleted successfully:", filePath);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
      if (thumbnailPath) {
        const thumbFilepath = path.join(thumbnailPath, "thumbnail_" + file);
        try {
          await fs.remove(thumbFilepath);
          console.log("Thumbnail deleted successfully:", thumbFilepath);
        } catch (err) {
          console.error("Error deleting thumbnail:", err);
        }
      }
    })
  );
}
