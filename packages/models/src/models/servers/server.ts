import { FileStruct } from '../media/attachment';
import { MemberCompositeKeyStruct } from './serverMember';

export interface ServerStruct {
  _id: MemberCompositeKeyStruct;
  reason: string;
}


export interface RoleStruct {
  name: string;
  permissions: number;
  colour: string;
  hoist?: boolean;
  rank: number;
}

export interface CategoryStruct {
  id: string;
  title: string;
  channels: string;
}

export interface SystemMessageChannels {
  user_joined: string;
  user_left: string;
  user_kicked: string;
  user_banned: string;
}

export enum ServerFlags {
  Verified = 1,
  Official = 2
}

export interface Server {
  _id: string;
  owner: string;
  name: string;
  description?: string;
  channels: Array<string>;
  categories?: Array<string>;
  system_messages?: SystemMessageChannels;
  roles: Map<string, RoleStruct>
  default_permissions: number;
  icon?: FileStruct;
  banner?: FileStruct;
  flags?: number;
  nsfw: boolean;
  analyrics: boolean;
  discoverable: boolean; 
}

export enum FieldsServer {
  Description,
  Categories,
  SystemMessages,
  Icon,
  Banner
}

export enum FieldsRole {
  Colour
}