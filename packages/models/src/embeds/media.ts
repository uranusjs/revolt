export enum ImageSize {
  Large,
  Preview
}

export interface ImageStruct {
  url: string;
  width: number;
  height: number;
  sized: ImageSize
}

export interface VideoStruct {
  url: string;
  width: number;
  height: number
}