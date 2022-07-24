import { FileStruct } from '../media/attachment';

/**
 * @description Relationship entry indicating current status with other user
 */
export enum Presence {
  Online,
  Idle,
  Busy,
  Invisible
}

export interface UserStatusStruct {
  text?: string;
  presence?: Presence
}

export interface UserProfileStruct {
  content?: string;
  background?: FileStruct;
}

export enum Badges {
  Developer = 1 << 0,
  Translator = 1 << 1,
  Supporter = 1 << 2,
  ResponsibleDisclosure = 1 << 3,
  Founder = 1 << 4,
  PlatformModeration = 1 << 5,
  ActiveSupporter = 1 << 6,
  Paw = 1 << 7,
  EarlyAdopter = 1 << 8,
  ReservedRevelantJokeBadge1 = 1 << 9,
  ReservedRevelantJokeBadge2 = 1 << 10,
}

export enum Flags {
  Suspended = 1 << 0,
  Deleted = 1 << 1,
  Banned = 1 << 2
}

export interface BotInformationStruct {
  owner: string;
}

export interface UserStruct {
  _id: string;
  username: string;
  avatar?: FileStruct;
  relations?: null;
  badges?: number;
  status?: UserStatusStruct;
  profile?: UserProfileStruct;
  flags?: number;
  privileged?: boolean;
  bot?: BotInformationStruct;
  relationship?: null;
  online?: boolean;
}

export enum FieldsUserStruct {
  Avatar,
  StatusText,
  StatusPresence,
  ProfileContent,
  ProfileBackground
}

export enum UserHint {
  Any,
  Bot,
  User
}