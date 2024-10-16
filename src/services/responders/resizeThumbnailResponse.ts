import cote from "cote";
import path from "node:path";
import sharp from "sharp";
import fs from "fs/promises";

const responder = new cote.Responder({ name: "thumbnailResizerResponder" });

interface ResizeRequest {
  type: string;
  filePath: string;
}

responder.on<ResizeRequest>("resize-to-thumbnail", async (req, done) => {
  const { filePath } = req;
  console.log("Esto es filePath: ", filePath);
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

    await sharp(filePath)
      .resize(120, 120, {
        fit: sharp.fit.cover,
        position: "center",
      })
      .toFile(outputFilePath);

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
