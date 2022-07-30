import type { CategoryStruct, ChannelTypeStruct, FieldsMember, FieldsRole, FieldsServer, SystemMessageChannels } from '@uranusjs/models-revolt';

export interface DataBanCreate {
  reason: string;
}

export interface DataCreateChannel {
  channel_type: ChannelTypeStruct;
  name: string;
  description: string;
  nsfw?: boolean;
}

export interface DataMemberEdit {
  nickname?: string;
  avatar?: string;
  roles?: string[];
  timeout?: number;
  remover?: FieldsMember
}

export interface DataRoleServer {
  permissions: number;
}

export interface DataSetServerDefaultPermission {
  permissions: number;
}

export interface DataCreateRole {
  name: string;
  rank: number;
}

export interface DataEditRole {
  name?: string;
  colour?: string;
  hoist?: boolean;
  rank?: number;
  remove?: FieldsRole
}

export interface DataCreateServer {
  name: string;
  description: string;
  nsfw?: boolean;
}

export interface DataEditServer {
  name?: string;
  description?: string;
  icon?: string;
  banner?: string;
  categories?: CategoryStruct[];
  system_messages?: SystemMessageChannels;
  discoverable?: boolean;
  analytics?: boolean;
  remove?: FieldsServer[]
}



