import * as cote from "cote";
import path from "node:path";
import Jimp from "jimp";
import fs from "fs";

const responder = new cote.Responder({ name: "thumbnailResizerResponder" });

interface ResizeRequest {
  filePath: string;
}

responder.on(
  "resize-to-thumbnail",
  async (req: ResizeRequest, done: (error: any, result?: any) => void) => {
    const filePath = req.filePath;

    try {
      const image = await Jimp.read(filePath);
      const thumbnailDir = path.join(path.dirname(filePath), "thumbnails");

      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir);
      }

      const outputFilePath = path.join(
        thumbnailDir,
        "thumbnail_" + path.basename(filePath)
      );

      const { width, height } = image.bitmap;
      const aspectRatio = width / height;

      if (aspectRatio > 1) {
        await image.scaleToFit(150, Jimp.AUTO).writeAsync(outputFilePath);
      } else {
        await image.scaleToFit(Jimp.AUTO, 150).writeAsync(outputFilePath);
      }

      done(null, {
        message: "Resize successful! ",
        outputFilePath: outputFilePath,
      });
    } catch (error) {
      console.error("Error resizing thumbnail: ", error);
      done(error);
    }
  }
);

export default responder;
