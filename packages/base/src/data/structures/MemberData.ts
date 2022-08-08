import type { FileStruct, MemberCompositeKeyStruct, MemberStruct } from '@uranusjs/models-revolt';

export class MemberData {
  _id?: MemberCompositeKeyStruct | string;
  joinedAt?: number;
  nickname?: string;
  avatar?: FileStruct;
  roles?: Array<string>;
  timeout?: number;
  constructor(data?: MemberStruct) {
    if (data !== undefined) {
     this.updateData(data)
   }
  }
  updateData(data?: MemberStruct) {
    if (data?._id !== undefined) {
      this._id = data._id;
    }
    if (data?.avatar !== undefined) {
      this.avatar = data.avatar;
    }
    if (data?.joined_at !== undefined) {
      this.joinedAt = data.joined_at;
    }
    if (data?.avatar !== undefined) {
      this.avatar = data.avatar;
    }
    if (data?.roles !== undefined) {
      this.roles = data.roles;
    }
    if (data?.timeout !== undefined) {
      this.timeout = data.timeout;
    }
  }
}