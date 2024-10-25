import mongoose from "mongoose";

export default async function assignFilesToFields(
  fieldsList: string[],
  files: object,
  assignedCollection: mongoose.Document
) {
  try {
    const flatteredReceivedFiles = Object.assign({}, files) as {
      [fieldname: string]: Express.Multer.File[];
    };
    fieldsList.forEach((field) => {
      if (
        flatteredReceivedFiles[field] &&
        flatteredReceivedFiles[field].length > 0
      ) {
        assignedCollection[field as keyof typeof assignedCollection] =
          flatteredReceivedFiles[field][0].filename;
      }
    });

    await assignedCollection.save();
    console.log("Files collection saved successfully");
  } catch (error) {
    console.log("Could not assign files collection: ", error);
  }
}
