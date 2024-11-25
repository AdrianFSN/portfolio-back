import mongoose from "mongoose";
import fs from "fs-extra";
import path from "path";

export default async function deleteFilesFromCollection(
  filesFieldsList: string[],
  filesCollection: mongoose.Document,
  filesPath: string,
  thumbnailPath?: string
) {
  if (!path.isAbsolute(filesPath)) {
    throw new Error(`Invalid filesPath: ${filesPath}`);
  }
  if (
    thumbnailPath &&
    (!path.isAbsolute(thumbnailPath) || !thumbnailPath.includes("image"))
  ) {
    throw new Error(`Invalid thumbnailPath: ${thumbnailPath}`);
  }

  const filesToDelete = filesFieldsList
    .map((field) => filesCollection[field as keyof typeof filesCollection])
    .filter(
      (value) => typeof value === "string" && value.trim() !== ""
    ) as string[];

  await Promise.all(
    filesToDelete.map(async (file: string) => {
      const filePath = path.join(filesPath, file);

      try {
        if (await fs.pathExists(filePath)) {
          const stats = await fs.lstat(filePath);
          if (stats.isFile()) {
            await fs.remove(filePath);
            console.log("File deleted successfully:", filePath);
          } else {
            console.log("Path is not a file, skipping:", filePath);
          }
        } else {
          console.log("File does not exist, skipping:", filePath);
        }
      } catch (err) {
        console.error("Error deleting file:", err);
      }

      if (thumbnailPath) {
        const thumbFilepath = path.join(thumbnailPath, "thumbnail_" + file);
        try {
          if (await fs.pathExists(thumbFilepath)) {
            const thumbStats = await fs.lstat(thumbFilepath);
            if (thumbStats.isFile()) {
              await fs.remove(thumbFilepath);
              console.log("Thumbnail deleted successfully:", thumbFilepath);
            } else {
              console.log(
                "Path is not a thumbnail file, skipping:",
                thumbFilepath
              );
            }
          } else {
            console.log("Thumbnail does not exist, skipping:", thumbFilepath);
          }
        } catch (error) {
          console.error("Error deleting thumbnail:", error);
        }
      }
    })
  );
}
