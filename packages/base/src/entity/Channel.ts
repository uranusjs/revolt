import type { DirectMessageStruct, GroupStruct, InteractionsStruct, MasqueradeStruct, PartialChannelStruct, ReplyStruct, SavedMessagesStruct, SendableEmbedStruct, TextChannelStruct, VoiceChannelStruct } from '@uranusjs/models-revolt';
import { ChannelsRoute, DataEditChannel, MessageUnreactOptions, NoRequired, OptionsQueryMessages, RestClient, RoutePath } from '@uranusjs/rest-revolt';
import { ChannelData, ChannelRest } from '../data/structures/ChannelData';
import { RestBase } from '../restAction/RestBase';


export interface DataMessageSend {
    nonce?: string;
    content?: string;
    attachments?: Array<string>;
    replies?: Array<ReplyStruct>;
    embeds?: Array<SendableEmbedStruct>;
    masquerade?: MasqueradeStruct;
    interactions?: InteractionsStruct;
}


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
        this.restBase = new RestBase(restClient);
    }


    setNsfw(nsfw: boolean) {
        if (typeof nsfw !== 'boolean') {
            throw new Error('Invalid input!');
        }

        return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TextChannel>({
            'route': ChannelsRoute.CHANNEL_EDIT(this.getId),
            'requestOptions': {
                'body': {
                    nsfw,
                },
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
    }

    sendMessage(messageOption: string | DataMessageSend) {
        let d;

        if (typeof messageOption === 'string') {
            d = {
                'content': messageOption,
            };
        }

        if (typeof messageOption === 'object') {
            if (messageOption.attachments !== undefined) {
                if (!Array.isArray(messageOption.attachments)) {
                    throw new Error('Fields called attachments have to be in Array!');
                }
            }
            if (messageOption.replies !== undefined) {
                if (!Array.isArray(messageOption.replies)) {
                    throw new Error('Fields called replies have to be in Array!');
                }
            }
            if (messageOption.embeds !== undefined) {
                if (!Array.isArray(messageOption.embeds)) {
                    throw new Error('Fields called embeds have to be in Array!');
                }
            }
            if (messageOption.interactions !== undefined) {
                if (messageOption.interactions.reactions !== undefined) {
                    if (!Array.isArray(messageOption.interactions.reactions)) {
                        throw new Error('messageOption.interactions.reactions is Array!');
                    }
                }
                if (messageOption.interactions.restrict_reactions !== undefined) {
                    if (typeof messageOption.interactions.restrict_reactions !== 'boolean') {
                        throw new Error('messageOption.interactions.restrict_reactions is boolean!');
                    }
                }
            }
            if (messageOption.masquerade?.avatar !== undefined) {
                if (typeof messageOption.masquerade?.avatar !== 'string') {
                    throw new Error('messageOption.masquerade?.avatar is String!');
                }
            }
            if (messageOption.nonce !== undefined) {
                if (typeof messageOption.nonce !== 'string') {
                    throw new Error('messageOption.masquerade?.avatar is String!');
                }
            }
            d = messageOption;
        }

        return this.restBase.executeAction<RoutePath.CHANNELS, string | DataMessageSend, TextChannel>({
            'route': ChannelsRoute.MESSAGE_SEND(this.getId),
            'requestOptions': {
                'body': d,
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
    }

    messageDelete(id: string) {
        return this.restBase.executeAction<RoutePath.CHANNELS, NoRequired, TextChannel>({
            'route': ChannelsRoute.MESSAGE_DELETE(this.getId, id),
            'requestOptions': {
                'body': undefined,
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
    }

    messageQuery(id: string, options: OptionsQueryMessages) {
        if (typeof id !== 'string') {
            throw new Error('ID is string!');
        }
        if (options !== undefined) {
            if (typeof options !== 'object') {
                throw new Error('options is Object.');
            }
            if (options.after !== undefined) {
                if (typeof options.after !== 'string') {
                    throw new Error('options.after is String!');
                }
            }
            if (options.before !== undefined) {
                if (typeof options.before !== 'string') {
                    throw new Error('options.before is String!');
                }
            }
            if (options.includeUsers !== undefined) {
                if (typeof options.includeUsers !== 'boolean') {
                    throw new Error('options.after is Boolean!');
                }
            }
            if (options.limit !== undefined) {
                if (typeof options.limit !== 'number') {
                    throw new Error('options.after is Number!');
                }
            }
            if (options.nearby !== undefined) {
                if (typeof options.nearby !== 'number') {
                    throw new Error('options.nearby is String!');
                }
            }
            if (options.sort !== undefined) {
                if (typeof options.sort !== 'number') {
                    throw new Error('options.nearby is Number/Enum!');
                }
            }
        } else {
            throw new Error('.messageQuery(id: string, options: OptionsQueryMessages): options is required');
        }

        return this.restBase.executeAction<RoutePath.CHANNELS, NoRequired, TextChannel>({
            'route': ChannelsRoute.MESSAGE_QUERY(this.getId, id, options),
            'requestOptions': {
                'body': undefined,
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
    }

    messageReact(id: string, emoji: string) {
        if (typeof id !== 'string') {
            throw new Error('ID is string!');
        }
        if (typeof emoji !== 'string') {
            throw new Error('emoji is string!');
        }
        return this.restBase.executeAction<RoutePath.CHANNELS, NoRequired, TextChannel>({
            'route': ChannelsRoute.MESSAGE_REACT(this.getId, id, emoji),
            'requestOptions': {
                'body': undefined,
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
    }

    messageUnreact(id: string, options: MessageUnreactOptions) {
        if (typeof id !== 'string') {
            throw new Error('ID is string!');
        }
        if (options !== undefined) {
            if (typeof options !== 'object') {
                throw new Error('options is Object!');
            }
            if (options.emoji !== undefined) {
                if (typeof options.emoji !== 'string') {
                    throw new Error('options.emoji is String!');
                }
            }
            if (options.extendOptions !== undefined) {
                if (options.extendOptions.user_id !== undefined) {
                    if (typeof options.extendOptions.user_id !== 'string') {
                        throw new Error('options.extendOptions.user_id is String!');
                    }
                }
                if (options.extendOptions.remove_all !== undefined) {
                    if (typeof options.extendOptions.user_id !== 'boolean') {
                        throw new Error('options.extendOptions.remove_all is String!');
                    }
                }
            }
        } else {
            throw new Error('Options is required');
        }
        return this.restBase.executeAction<RoutePath.CHANNELS, NoRequired, TextChannel>({
            'route': ChannelsRoute.MESSAGE_UNREACT(this.getId, id, options),
            'requestOptions': {
                'body': undefined,
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
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
