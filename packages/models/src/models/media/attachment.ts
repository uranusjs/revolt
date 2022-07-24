export enum Metadata {
  File,
  Text,
  Image,
  Video,
  Audio
}

export interface FileStruct {
  _id: string;
  tag: string;
  filename: string;
  metadata: string;
  content_type: string;
  size: number;
  deleted?: boolean;
  reported?: boolean;
  message_id?: string;
  user_id?: string;
  server_id?: string;
  object_id?: string;
}