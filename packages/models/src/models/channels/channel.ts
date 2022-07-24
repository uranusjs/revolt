import type { FileStruct } from '../media/attachment';

export interface SavedMessagesStruct {
  _id: string;
  user: string;
}

export interface DirectMessageStruct {
  _id: string;
  active: boolean;
  recipients: Array<string>
  last_message_id?: string;
}


export interface GroupStruct {
  _id: string;
  name: string;
  owner: string;
  description?: string;
  recipients: Array<String>;
  icon?: FileStruct;
  last_message_id?: string;
  permissions?: string;
  nsfw?: boolean;
}

export interface TextChannelStruct {
  _id: string;
  server: string;
  name: string;
  description?: string;
  icon?: FileStruct;
  last_message_id?: string;
  default_permissions?: number;
  role_permissions: Map<string, number>;
  nsfw: boolean;
}

export interface VoiceChannelStruct {
  _id?: string;
  server: string;
  name: string;
  description?: string;
  icon?: FileStruct;
  default_permissions?: number;  
  role_permissions: Map<string, number>;
  nsfw: boolean;
}

export interface PartialChannelStruct {
  name?: string;
  owner?: string;
  description?: string;
  icon?: FileStruct;
  nsfw?: boolean;
  active?: boolean;
  permissions?: number;
  role_permissions?: Map<string, number>;
  default_permissions?: number;
  last_message_id?: string;
}

export enum ChannelStruct {
  SavedMessagesStruct,
  DirectMessageStruct,
  GroupStruct,
  TextChannelStruct,
  VoiceChannelStruct,
  PartialChannelStruct
}

export enum FieldsChannels {
  Description,
  Icon,
  DefaultPermissions
}