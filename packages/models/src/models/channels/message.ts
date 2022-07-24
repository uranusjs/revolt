import type { MetadataEmbedStruct } from '../../embeds/embed';
import type { FileStruct } from '../media/attachment';
import type { MemberStruct } from '../servers/serverMember';
import type { UserStruct } from '../users/user';

export interface SendableEmbedStruct {
  icon_url: string;
  url: string;
  title: string;
  description: string;
  media: string;
  colour: string;
}

export enum SystemMessage {
  Text,
  UserAdded,
  UserRemove,
  UserJoined,
  UserLeft,
  UserKicked,
  UserBanned,
  ChannelRenamed,
  ChannelDescriptionChanged,
  ChannelIconChanged,
  ChannelOwnershipChanged
}

export interface TextSystemMessageStruct {
  content: string;
}
export interface UserByIdSystemMessageStruct {
  id: string;
}

export interface SystemMessageStruct {
  id?: string;
  by?: string;
}

export interface UserSystemMessageStruct extends SystemMessageStruct { }

export interface UserAddedSystemMessageStruct extends UserSystemMessageStruct { }
export interface UserRemoveSystemMessageStruct extends UserSystemMessageStruct { }

export interface UserJoinedSystemMessageStruct extends UserByIdSystemMessageStruct { }
export interface UserLeftSystemMessageStruct extends UserByIdSystemMessageStruct { }
export interface UserKickedSystemMessageStruct extends UserByIdSystemMessageStruct { }
export interface UserBannedSystemMessageStruct extends UserByIdSystemMessageStruct { }

export interface ChannelRenamedSystemMessageStruct extends SystemMessageStruct { }
export interface ChannelDescriptionChangedSystemMessageStruct extends SystemMessageStruct { }
export interface ChannelIconChangedSystemMessageStruct extends SystemMessageStruct { }
export interface ChannelOwnershipChangedSystemMessageStruct {
  from: string;
  to: string;
}

export interface MasqueradeStruct {
  name: string;
  avatar: string;
  colour: string;
}

export interface InteractionsStruct {
  reactions: Array<string>;
  restrict_reactions: boolean;
}

export enum MessageSort {
  Relevance,
  Latest,
  Oldest
}

export enum BulkMessageResponse {
  JustMessages,
  MessagesAndUsers
}

export interface JustMessagesStruct {
  message: Array<MessageStruct>;
}

export interface MessageAndUsers {
  messages: Array<MessageStruct>;
  users: Array<UserStruct>;
  members?: Array<MemberStruct>;
}

export interface AppendMessage {
  embeds: Array<MetadataEmbedStruct>
}

export interface MessageStruct {
  _id: string;
  nonce?: string;
  channel: string;
  author: string;
  content?: string;
  system?: SystemMessage;
  attachments?: Array<FileStruct>;
  edited?: number;
  embeds?: Array<MetadataEmbedStruct>;
  mentions?: Array<string>;
  replies?: Array<string>;
  reactions: Map<string, Array<string>>;
  interactions: InteractionsStruct;
  masquerade?: MasqueradeStruct;
}