import type { FieldsChannels, SendableEmbedStruct } from '@uranusjs/models-revolt';

export interface DataEditChannel {
  name: string;
  description: string;
  owner: string;
  icon: string;
  nsfw: boolean;
  remove: FieldsChannels[];
}

export interface DataEditMessage {
  content: string;
  embeds: SendableEmbedStruct[];
}

export interface OptionsBulkDelete {
  ids: string[];
}

export interface DataRoleChannel {
  permissions: number;
}

export interface CreateVoiceUserResponse {
  token: string;
}
