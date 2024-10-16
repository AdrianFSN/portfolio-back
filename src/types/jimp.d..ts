declare module "jimp" {
  export interface Jimp {
    bitmap: {
      width: number;
      height: number;
    };
    cover(width: number, height: number): this;
    scaleToFit(width: number, height: number): this;
    writeAsync(path: string): Promise<void>;
  }

  export const AUTO: number;
  export function read(path: string | Buffer): Promise<Jimp>;
}
