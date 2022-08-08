import type { EmojiParent, EmojiStruct } from '@uranusjs/models-revolt';

export class EmojiData {
  _id?: string;
  parent?: EmojiParent;
  creatorId?: string;
  name?: string;
  animated?: boolean;
  nsfw?: boolean;
  constructor(data?: EmojiStruct) {
    if (data !== undefined) {
     this.updateData(data)
   }
  }
  updateData(data?: EmojiStruct) {
    if (data?._id !== undefined) {
      this._id = data._id;
    }
    if (data?.animated !== undefined) {
      this.animated = data.animated;
    }
    if (data?.creator_id !== undefined) {
      this.creatorId = data.creator_id;
    }
    if (data?.name !== undefined) {
      this.name = data.name;
    }
    if (data?.nsfw !== undefined) {
      this.nsfw = data.nsfw;
    }
  }
}