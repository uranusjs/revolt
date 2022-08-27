import { Event } from '@uranusjs/ws-revolt';
import { handleReady } from '../data/utils/handleEvent';
import type { RevoltClient } from '../RevoltBase';

export class WebSocketManager {
  revoltClient: RevoltClient;
  constructor(revoltClient: RevoltClient) {
    this.revoltClient = revoltClient;
    this.revoltClient.websocketClient.on('debugMessage', (data: any) => {
      if (data.type !== undefined) {
        this.eventOn(data.type, data)
      }
    })
  }

  eventOn(event: Event, data: any) {
    switch (event) {
      case Event.Ready:
        handleReady(data, this.revoltClient)
        break;
    
      default:
        break;
    }

  }
}