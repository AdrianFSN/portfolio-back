import { createRequire } from "node:module";
import fs from "fs-extra";

const require = createRequire(import.meta.url);
const cote = require("cote");

type CallbackFunction = (error: Error | null, result: any) => void;

const requester = new cote.Requester({ name: "imageResizerRequester" });

interface ResizeEvent {
  type: string;
  filePath: string;
}

const resizeImage = async (filePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    sendOrderToResizeEvent(filePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const sendOrderToResizeEvent = async (
  filePath: string,
  callback: CallbackFunction
): Promise<void> => {
  try {
    await fs.access(filePath);
  } catch (error) {
    console.error(`Image does not exist at path: ${filePath}`);
    return callback(
      error instanceof Error ? error : new Error(String(error)),
      null
    );
  }

  const event: ResizeEvent = {
    type: "resize-to-thumbnail",
    filePath,
  };

  console.log("Sending resize event: ", event);

  requester.send(event, (error: any, result: any) => {
    if (error) {
      console.error("Error in resize event: ", error);
      return callback(
        error instanceof Error ? error : new Error(String(error)),
        null
      );
    }
    filePath = "";
    callback(null, result);
  });
};

console.log("Requester is running...");

export default resizeImage;
