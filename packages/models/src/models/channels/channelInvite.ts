export interface ServerInviteStruct {
  _id: string;
  server: string;
  creator: string;
  channel: string;
}

export interface GroupInviteStruct {
  _id: string;
  creator: string;
  channel: string;
}

export enum Invite {
  ServerInviteStruct,
  GroupInviteStruct
}