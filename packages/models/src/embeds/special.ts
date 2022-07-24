export enum Twitch {
  Channel,
  Video,
  Clip
}

export enum Lightspeed {
  Channel
}

export enum Bandcamp {
  Album,
  Track
}

export enum Special {
  None,
  Gif,
  Youtube,
  LightspeedType,
  Twitch,
  Spotify,
  Soundcloud,
  Bandcamp
}

export interface YoutubeSpecialStruct {
  id: string;
  timestamp?: number;
}

export interface InterfaceSpecialStruct{
  content_type: string;
  id: string;
}