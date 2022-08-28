import { RestClient } from '@uranusjs/rest-revolt';
import { WebsocketClient } from '@uranusjs/ws-revolt';
import { DataStorageBase } from './data/DataStorage';
import type { MemberData } from './data/structures/MemberData';
import type { ServerData } from './data/structures/ServerData';
import type { Channel, DirectMessage, Group, SavedMessages, TextChannel, VoiceChannel } from './entity/Channel';
import { WebSocketManager } from './ws/WebSocketManager';

export enum Logging {
  DEBUG,
  ANY,
  NONE
}

export class BlockExtension {
    revolt: RevoltClient;
    constructor(token: string, restClient: RestClient, websocketClient: WebsocketClient) {
        this.revolt = new RevoltClient(token, restClient, websocketClient);
    }

    build() {
        this.revolt.websocketClient.connect();
        return this.revolt;
    }

    static extends(token: string, restClient: RestClient, websocketClient: WebsocketClient) {
        return new BlockExtension(token, restClient, websocketClient);
    }
}

export class Caches {
    servers: DataStorageBase<ServerData>;
    channels: DataStorageBase<Channel | TextChannel | VoiceChannel | SavedMessages | DirectMessage | Group>;
    members: DataStorageBase<MemberData>;
    constructor() {
        this.servers = DataStorageBase.createBase<ServerData>({});
        this.channels = DataStorageBase.createBase<Channel | TextChannel | VoiceChannel | SavedMessages | DirectMessage | Group>({});
        this.members = DataStorageBase.createBase<MemberData>({});
    }
}

export class RevoltClient {
    websocketClient: WebsocketClient;
    restClient: RestClient;
    token: string;
    cacheManager: Caches;
    websocketManager: WebSocketManager;

    constructor(token: string, restClient: RestClient, websocketClient: WebsocketClient) {
        this.token = token;
        this.restClient = restClient;
        this.websocketClient = websocketClient;
        this.cacheManager = new Caches();
        this.websocketManager = new WebSocketManager(this);
    }

    block() {
        this.websocketClient.connect();
    }

    static create(token: string) {
        const restClient = new RestClient({
            'sessionToken': token,
        });
        const wsClient = new WebsocketClient({
            'token': token,
        });

        return BlockExtension.extends(token, restClient, wsClient);
    }
}