import { FileStruct } from '../media/attachment';

export interface MemberCompositeKeyStruct {
  server: string;
  user: string;
}

export interface MemberStruct {
  _id: MemberCompositeKeyStruct;
  joined_at: number;
  nickname?: string;
  avatar?: FileStruct;
  roles: Array<string>;
  timeout?: number;
}

export enum FieldsMember {
  Nickname,
  Avatar,
  Roles,
  Timeout
}

export enum RemovalIntention {
  Leave,
  Kick,
  Ban
}