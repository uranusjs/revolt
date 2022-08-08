import type { FileStruct, InteractionsStruct, MasqueradeStruct, PartialChannelStruct, ReplyStruct, SendableEmbedStruct } from '@uranusjs/models-revolt';
import { ChannelsRoute, DataEditChannel, RestClient, RoutePath } from '@uranusjs/rest-revolt';
import { RestBase } from 'src/rest/RestBase';

export interface DataMessageSend {
  nonce?: string;
  content?: string;
  attachments?: Array<string>;
  replies?: Array<ReplyStruct>;
  embeds?: Array<SendableEmbedStruct>;
  masquerade?: MasqueradeStruct;
  interactions?: InteractionsStruct;
}


export class ChannelData {
  id?: string;
  name?: string;
  owner?: string;
  description?: string;
  icon?: FileStruct;
  nsfw?: boolean;
  active?: boolean;
  permissions?: number;
  defaultPermissions?: number;
  lastMessageId?: string;
  constructor(data?: PartialChannelStruct) {
    if (data !== undefined) {
      this.updateDate(data);
    }
  }

  updateDate(data?: PartialChannelStruct) {
    if (data?.name !== undefined) {
      this.name = data.name;
    }
    if (data?.owner !== undefined) {
      this.owner = data.owner
    }
    if (data?.description !== undefined) {
      this.description = data.description
    }
    if (data?.icon !== undefined) {
      this.icon = data.icon
    }
    if (data?.nsfw !== undefined) {
      this.nsfw = data.nsfw
    }
    if (data?.active !== undefined) {
      this.active = data.active
    }
    if (data?.permissions !== undefined) {
      this.permissions = data.permissions
    }
    if (data?.default_permissions !== undefined) {
      this.defaultPermissions = data.default_permissions
    }
    if (data?.last_message_id !== undefined) {
      this.lastMessageId = data.last_message_id
    }
  }
}

export class ChannelRest<TypeChannel> extends ChannelData {
  private channelData: ChannelData;
  private restBase: RestBase;
  constructor(restClient: RestClient, channelData: ChannelData) {
    super()
    this.restBase = new RestBase(restClient);
    this.channelData = channelData;
  }

  modifyName(name: string) {
    if (typeof name !== 'string') throw new Error('Invalid text input!');
    if (name.length < 1) {
      throw new Error('You need to enter at least one word to change the channel name.');
    } if (name.length >= 32) {
      throw new Error('The maximum length the channel allows is 32 characters.');
    }

    return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TypeChannel>({
      route: ChannelsRoute.CHANNEL_EDIT(this.channelData.id!!),
      requestOptions: {
        body: {
          name: name
        },
        isJson: true,
        isRequiredAuth: true,
      }
    })
  }


  modifyDescription(description: string) {
    if (typeof description !== 'string') throw new Error('Invalid text input!');
    if (description.length < -1) {
      throw new Error('You need to enter at least one word to change the channel description.');
    } if (description.length >= 1024) {
      throw new Error('The maximum length the channel allows is 32 characters.');
    }

    return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TypeChannel>({
      route: ChannelsRoute.CHANNEL_EDIT(this.channelData.id!!),
      requestOptions: {
        body: {
          description: description
        },
        isJson: true,
        isRequiredAuth: true,
      }
    })
  }


  setIcon(icon: string) {
    if (typeof icon !== 'string') throw new Error('Invalid text input!');
    if (icon.length < 1) {
      throw new Error('You need to enter at least one word to change the channel icon.');
    } if (icon.length >= 128) {
      throw new Error('The maximum length the channel allows is 32 characters.');
    }

    return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TypeChannel>({
      route: ChannelsRoute.CHANNEL_EDIT(this.channelData.id!!),
      requestOptions: {
        body: {
          icon: icon
        },
        isJson: true,
        isRequiredAuth: true,
      }
    })
  }

  deleteChannel() {
    return this.restBase.executeAction<RoutePath.CHANNELS, null, TypeChannel>({
      route: ChannelsRoute.CHANNEL_DELETE(this.channelData.id!!),
      requestOptions: {
        body: undefined,
        isJson: true,
        isRequiredAuth: true,
      }
    })
  }


  fetchChannel() {
    return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TypeChannel>({
      route: ChannelsRoute.CHANNEL_FETCH(this.channelData.id!!),
      requestOptions: {
        body: undefined,
        isJson: true,
        isRequiredAuth: true,
      }
    })
  }


  setNsfw(nsfw: boolean) {
    if (typeof nsfw !== 'boolean') throw new Error('Invalid input!');

    return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TypeChannel>({
      route: ChannelsRoute.CHANNEL_EDIT(this.channelData.id!!),
      requestOptions: {
        body: {
          nsfw: nsfw
        },
        isJson: true,
        isRequiredAuth: true,
      }
    })
  }

  sendMessage(messageOption: string | DataMessageSend) {
    let d;
    if (typeof messageOption == 'string') {
      d = messageOption
    } if (typeof messageOption === 'object') {
      if (messageOption.attachments !== undefined) {
        if (!Array.isArray(messageOption.attachments)) throw new Error('Fields called attachments have to be in Array!');
      }
      if (messageOption.replies !== undefined) {
        if (!Array.isArray(messageOption.replies)) throw new Error('Fields called replies have to be in Array!');
      }
      if (messageOption.embeds !== undefined) {
        if (!Array.isArray(messageOption.embeds)) throw new Error('Fields called embeds have to be in Array!');
      }
      if (messageOption.interactions !== undefined) {
        if (messageOption.interactions.reactions !== undefined) {
          if (!Array.isArray(messageOption.interactions.reactions)) throw new Error('messageOption.interactions.reactions is Array!');
        }
        if (messageOption.interactions.restrict_reactions !== undefined) {
          if (typeof messageOption.interactions.restrict_reactions != 'boolean') throw new Error('messageOption.interactions.restrict_reactions is boolean!');
        }
      }
      if (messageOption.masquerade?.avatar !== undefined) {
        if (typeof messageOption.masquerade?.avatar !== 'string') throw new Error('messageOption.masquerade?.avatar is String!');
      }
      if (messageOption.nonce !== undefined) {
        if (typeof messageOption.nonce !== 'string') throw new Error('messageOption.masquerade?.avatar is String!');
      }
      d = messageOption;
    }

    return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TypeChannel>({
      route: ChannelsRoute.MESSAGE_SEND(this.channelData.id!!),
      requestOptions: {
        body: d,
        isJson: true,
        isRequiredAuth: true,
      }
    })
  }
}




