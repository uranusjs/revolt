import type { FieldsChannels, SendableEmbedStruct } from '@uranusjs/models-revolt';

export interface DataEditChannel {
  name: string;
  description: string;
  owner: string;
  icon: string;
  nsfw: boolean;
  remove: Array<FieldsChannels>;
}


export interface DataEditMessage {
  content: string;
  embeds: Array<SendableEmbedStruct>;
}

export interface OptionsBulkDelete {
  ids: Array<string>;
}