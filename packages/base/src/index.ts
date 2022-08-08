import { RestClient } from '@uranusjs/rest-revolt';
import { WebsocketClient } from '@uranusjs/ws-revolt';
import { DataStorageBase } from './data/DataStorage';
import type { ChannelData } from './data/structures/ChannelData';
import type { MemberData } from './data/structures/MemberData';
import type { ServerData } from './data/structures/ServerData';


export enum Logging {
  DEBUG,
  ANY,
  NONE
}

export class BlockExtension {
  revolt: RevoltChat;
  constructor(token: string, restClient: RestClient, websocketClient: WebsocketClient) {
    this.revolt = new RevoltChat(token, restClient, websocketClient)
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
  channels: DataStorageBase<ChannelData>;
  members: DataStorageBase<MemberData>;
  constructor() {
    this.servers = DataStorageBase.createBase<ServerData>({})
    this.channels = DataStorageBase.createBase<ChannelData>({})
    this.members = DataStorageBase.createBase<MemberData>({})
  }
}

export class RevoltChat {
  websocketClient: WebsocketClient;
  restClient: RestClient;
  token: string;


  constructor(token: string, restClient: RestClient, websocketClient: WebsocketClient) {
    this.token = token;
    this.restClient = restClient;
    this.websocketClient = websocketClient;
  }

  block() {
    this.websocketClient.connect()
  }

  static create(token: string) {
    const restClient = new RestClient({
      sessionToken: token
    });
    const wsClient = new WebsocketClient({
      token: token
    })

    return BlockExtension.extends(token, restClient, wsClient)
  }
}