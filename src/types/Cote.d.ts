import "cote";

declare module "cote" {
  interface Event {
    type: string;
    filePath: string;
  }
}
