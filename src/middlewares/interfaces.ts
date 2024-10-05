export interface CustomRequest extends Request {
  files: {
    pictures?: Express.Multer.File[];
    videos?: Express.Multer.File[];
  };
}
