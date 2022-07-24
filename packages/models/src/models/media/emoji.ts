export enum EmojiParent {
  Server,
  Detached
}

export interface EmojiStruct {
  _id: string;
  parent: EmojiParent;
  creator_id: string;
  name: string;
  animated: boolean;
  nsfw: boolean;
}