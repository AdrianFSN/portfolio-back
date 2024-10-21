import cote from "cote";
import fs from "fs-extra";

const requester = new cote.Requester({ name: "imageResizerRequester" });

interface ResizeEvent {
  type: string;
  filePath: string;
}

const resizeImage = async (filePath: string) => {
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
  callback: (error: any, result: any) => void
) => {
  try {
    await fs.access(filePath);
  } catch (error) {
    console.error(`Img does not exist in the path: ${filePath}`);
    return callback(error, null);
  }

  const event: ResizeEvent = {
    type: "resize-to-thumbnail",
    filePath,
  };

  console.log("Sending resize event: ", event);

  requester.send(event, (error, result) => {
    if (error) {
      console.error("Error in resize event: ", error);
      return callback(error, null);
    }
    filePath = "";
    callback(null, result);
  });
};

console.log("Requester is running...");

export default resizeImage;
