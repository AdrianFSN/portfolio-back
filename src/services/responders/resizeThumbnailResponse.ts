import cote from "cote";
import path from "node:path";
import sharp from "sharp";
import fs from "fs-extra";
import { THUMBNAIL_SIZE } from "../../utils/constants.js";

const responder = new cote.Responder({ name: "thumbnailResizerResponder" });

interface ResizeRequest {
  type: string;
  filePath: string;
}

sharp.cache(false);

responder.on<ResizeRequest>("resize-to-thumbnail", async (req, done) => {
  let { filePath } = req;

  if (!filePath) {
    const error = new Error("filePath is required");
    console.error(error.message);
    return done(error, null);
  }

  try {
    const thumbnailDir = path.join(path.dirname(filePath), "thumbnails");

    try {
      await fs.access(thumbnailDir);
    } catch {
      await fs.mkdir(thumbnailDir);
    }

    const outputFilePath = path.join(
      thumbnailDir,
      "thumbnail_" + path.basename(filePath)
    );

    const image = sharp(filePath);

    const metadata = await image.metadata();

    if (metadata && metadata.width && metadata.height) {
      const aspectRatio = metadata.width / metadata.height;
      let newWidth = THUMBNAIL_SIZE;
      let newHeight = Math.round(newWidth / aspectRatio);
      if (newHeight > THUMBNAIL_SIZE) {
        newHeight = THUMBNAIL_SIZE;
        newWidth = Math.round(newHeight * aspectRatio);
      }

      await image.resize(newWidth, newHeight).toFile(outputFilePath);

      image.destroy();
      filePath = "";
    }

    done(null, {
      message: "Resize successful! ",
      outputFilePath: outputFilePath,
    });
  } catch (error) {
    console.error("Error resizing thumbnail: ", error);
    done(error, null);
  }
});

console.log("Responder is running...");

export default responder;
