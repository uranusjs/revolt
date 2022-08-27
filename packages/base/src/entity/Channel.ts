import type { DirectMessageStruct, GroupStruct, PartialChannelStruct, SavedMessagesStruct, TextChannelStruct, VoiceChannelStruct } from '@uranusjs/models-revolt';
import type { RestClient } from '@uranusjs/rest-revolt';
import { ChannelData, ChannelRest } from '../data/structures/ChannelData';

export class ChannelManager<T> extends ChannelRest<T> { }

export class Channel extends ChannelManager<PartialChannelStruct> {
    constructor(restClient: RestClient, data: ChannelData) {
        super(restClient, data);
        this.updateData(data);
    }
}

export class TextChannel extends ChannelManager<TextChannelStruct> {
    constructor(restClient: RestClient, data: ChannelData) {
        super(restClient, data);
        this.updateData(data);
    }
}
export class VoiceChannel extends ChannelManager<VoiceChannelStruct> {
    constructor(restClient: RestClient, data: ChannelData) {
        super(restClient, data);
        this.updateData(data);
    }
}
export class SavedMessages extends ChannelManager<SavedMessagesStruct> {
    constructor(restClient: RestClient, data: ChannelData) {
        super(restClient, data);
        this.updateData(data);
    }
}
export class DirectMessage extends ChannelManager<DirectMessageStruct> {
    constructor(restClient: RestClient, data: ChannelData) {
        super(restClient, data);
        this.updateData(data);
    }
}
export class Group extends ChannelManager<GroupStruct> {
    constructor(restClient: RestClient, data: ChannelData) {
        super(restClient, data);
        this.updateData(data);
    }
}
