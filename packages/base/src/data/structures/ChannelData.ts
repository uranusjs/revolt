import type { FileStruct, PartialChannelStruct } from '@uranusjs/models-revolt';
import { ChannelsRoute, DataEditChannel, RestClient, RoutePath } from '@uranusjs/rest-revolt';
import { RestBase } from '../../restAction/RestBase';

export class ChannelData {
    private id: string | null = null;
    private type: string | null = null;
    private name: string | null = null;
    private owner: string | null = null;
    private description: string | null = null;
    private icon: FileStruct | null = null;
    private nsfw: boolean | null = null;
    private active: boolean | null = null;
    private permissions: number | null = null;
    private defaultPermissions: number | null = null;
    private lastMessageId: string | null = null;

    get getId() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.id!;
    }

    get getChannelType() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.type!;
    }

    get getName() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.name!;
    }

    get getOwner() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.owner!;
    }

    get getDescription() {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.description!;
    }

    get getIcon() {
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.icon!;
    }

    get isNsfw() {
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.nsfw!;
    }

    get getActive() {
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.active!;
    }

    get getPermission() {
        return this.permissions!;
    }

    get getPermissionsDefault() {
        return this.defaultPermissions
    }

    constructor(data?: PartialChannelStruct) {
        if (data !== undefined) {
            this.updateData(data);
        }
    }

    updateData(data?: any | ChannelData) {
        if (data?.id !== undefined) {
            this.id = data.id;
        } else if (data._id !== undefined) {
            this.id = data._id;
        }
        if (data?.channel_type !== undefined) {
            this.type = data.channel_type;
        } else if (data?.type !== undefined) {
            this.type = data.type;
        }
        if (data?.name !== undefined) {
            this.name = data.name;
        }
        if (data?.owner !== undefined) {
            this.owner = data.owner;
        }
        if (data?.description !== undefined) {
            this.description = data.description;
        }
        if (data?.icon !== undefined) {
            this.icon = data.icon;
        }
        if (data?.nsfw !== undefined) {
            this.nsfw = data.nsfw;
        }
        if (data?.active !== undefined) {
            this.active = data.active;
        }
        if (data?.permissions !== undefined) {
            this.permissions = data.permissions;
        }
        if (data?.default_permissions !== undefined) {
            this.defaultPermissions = data.default_permissions;
        }
        if (data?.last_message_id !== undefined) {
            this.lastMessageId = data.last_message_id;
        }
        return this;
    }
}

export class ChannelRest<TypeChannel> extends ChannelData {
    private channelData: ChannelData;
    protected restBase: RestBase;
    constructor(restClient: RestClient, channelData: ChannelData) {
        super();
        this.restBase = new RestBase(restClient);
        this.channelData = channelData;
    }

    modifyName(name: string) {
        if (typeof name !== 'string') {
            throw new Error('Invalid text input!');
        }
        if (name.length < 1) {
            throw new Error('You need to enter at least one word to change the channel name.');
        }

        if (name.length >= 32) {
            throw new Error('The maximum length the channel allows is 32 characters.');
        }

        return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TypeChannel>({
            'route': ChannelsRoute.CHANNEL_EDIT(this.channelData.getId),
            'requestOptions': {
                'body': {
                    name,
                },
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
    }

    modifyDescription(description: string) {
        if (typeof description !== 'string') {
            throw new Error('Invalid text input!');
        }
        if (description.length < -1) {
            throw new Error('You need to enter at least one word to change the channel description.');
        }

        if (description.length >= 1024) {
            throw new Error('The maximum length the channel allows is 32 characters.');
        }

        return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TypeChannel>({
            'route': ChannelsRoute.CHANNEL_EDIT(this.channelData.getId),
            'requestOptions': {
                'body': {
                    description,
                },
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
    }

    setIcon(icon: string) {
        if (typeof icon !== 'string') {
            throw new Error('Invalid text input!');
        }
        if (icon.length < 1) {
            throw new Error('You need to enter at least one word to change the channel icon.');
        }

        if (icon.length >= 128) {
            throw new Error('The maximum length the channel allows is 32 characters.');
        }

        return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TypeChannel>({
            'route': ChannelsRoute.CHANNEL_EDIT(this.channelData.getId),
            'requestOptions': {
                'body': {
                    icon,
                },
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
    }

    deleteChannel() {
        return this.restBase.executeAction<RoutePath.CHANNELS, null, TypeChannel>({
            'route': ChannelsRoute.CHANNEL_DELETE(this.channelData.getId),
            'requestOptions': {
                'body': undefined,
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
    }

    fetchChannel() {
        return this.restBase.executeAction<RoutePath.CHANNELS, DataEditChannel, TypeChannel>({
            'route': ChannelsRoute.CHANNEL_FETCH(this.channelData.getId),
            'requestOptions': {
                'body': undefined,
                'isJson': true,
                'isRequiredAuth': true,
            },
        });
    }

    permissionsSet() {
      // TODO: Permissions Manager soon!
    }

    permissionsSetDefault() {
    // TODO: Permissions Manager soon!
    }
}

