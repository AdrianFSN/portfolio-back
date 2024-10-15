import cote from "cote";
const requester = new cote.Requester({ name: "imageResizerRequester" });

interface ResizeEvent {
  type: string;
  filePath: string;
}

const sendOrderToResizeEvent = (
  filePath: string,
  callback: (error: any, result: any) => void
) => {
  const event: ResizeEvent = {
    type: "resize-to-thumbnail",
    filePath,
  };
  requester.send(event, (error, result) => {
    if (error) {
      console.error("Error in resize event: ", error);
      return callback(error, null);
    }
    callback(null, result);
  });
};

export default sendOrderToResizeEvent;
