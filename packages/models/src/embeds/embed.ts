import type { ImageStruct, VideoStruct } from './media';
import type { Special } from './special';

export enum TypeEmbed {
  Website,
  Image,
  Video,
  None
}

export interface MetadataEmbedStruct {
  url: string;
  original_url: string;
  special: Special;
  title?: string;
  description?: string;
  image?: ImageStruct;
  video?: VideoStruct;
  opengraph_type?: string;
  site_name?: string;
  icon_url?: string;
  colour?: string;
}