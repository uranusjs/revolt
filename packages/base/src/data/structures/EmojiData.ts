import type { EmojiParent, EmojiStruct } from '@uranusjs/models-revolt';

export class EmojiData {
  _id: string | null = null;
  parent: EmojiParent | null = null;
  creatorId: string | null = null;
  name: string | null = null;
  animated: boolean | null = null;
  nsfw: boolean | null = null;
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