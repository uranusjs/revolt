import type { DirectMessageStruct, GroupStruct, PartialChannelStruct, SavedMessagesStruct, TextChannelStruct, VoiceChannelStruct } from '@uranusjs/models-revolt';
import { ChannelRest } from 'src/data/structures/ChannelData';


export class ChannelManager<T> extends ChannelRest<T>{ }

export class Channel extends ChannelManager<PartialChannelStruct> { }

export class TextChannel extends ChannelManager<TextChannelStruct> { }
export class VoiceChannel extends ChannelManager<VoiceChannelStruct> { }
export class SavedMessages extends ChannelManager<SavedMessagesStruct> { }
export class DirectMessage extends ChannelManager<DirectMessageStruct> { }
export class Group extends ChannelManager<GroupStruct> { }