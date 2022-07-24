export interface ChannelCompositeKeyStruct {
  channel: string;
  user: string;
}

export interface ChannelUnreadStruct {
  _id: string;
  last_id?: string;
  mentions?: Array<string>;
}