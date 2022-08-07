import EventEmitter from 'events';
import WebSocket from 'ws';
export enum WebSocketAPI {
  URL = 'wss://ws.revolt.chat/'
}
export enum Event {
  Authenticated = 'Authenticated',
  Ready = 'Ready',
  Pong = 'Pong',
  UserUpdate = 'UserUpdate',
  UserRelationship = 'UserRelationship',
  UserSettingsUpdate = 'UserSettingsUpdate',
  Message = 'Message',
  MessageAppend = 'MessageAppend',
  MessageUpdate = 'MessageUpdate',
  MessageDelete = 'MessageDelete',
  MessageReact = 'MessageReact',
  MessageUnreact = 'MessageUnreact',
  MessageRemoveReaction = 'MessageRemoveReaction',
  BulkMessageDelete = 'BulkMessageDelete',
  ChannelStartTyping = 'ChannelStartTyping',
  ChannelStopTyping = 'ChannelStopTyping',
  ChannelAck = 'ChannelAck',
  ChannelCreate = 'ChannelCreate',
  ChannelUpdate = 'ChannelUpdate',
  ChannelDelete = 'ChannelDelete',
  ChannelGroupJoin = 'ChannelGroupJoin',
  ChannelGroupLeave = 'ChannelGroupLeave',
  ServerMemberUpdate = 'ServerMemberUpdate',
  ServerMemberLeave = 'ServerMemberLeave',
  ServerMemberJoin = 'ServerMemberJoin',
  ServerCreate = 'ServerCreate',
  ServerUpdate = 'ServerUpdate',
  ServerDelete = 'ServerDelete',
  ServerRoleUpdate = 'ServerRoleUpdate',
  ServerRoleDelete = 'ServerRoleDelete',
  EmojiCreate = 'EmojiCreate',
  EmojiDelete = 'EmojiDelete'
}

export enum EventAction {
  Authenticate = 'Authenticate',
  Ping = 'Ping',
  BeginTyping = 'BeginTyping',
  EndTyping = 'EndTyping'
}


export enum EventError {
  LabelMe,
  InternalError,
  InvalidSession,
  OnboardingNotFinished,
  AlreadyAuthenticated,
  MalformedData
}

export interface WebsocketClientOptions {
  token: string;
}

export interface WebsocketClient {
  on(event: 'debug', listener: any): this;
  on(event: 'debugSend', listener: any): this;
  on(event: 'debugMessage', listener: any): this;
  on(event: 'debugMessage', listener: any): this;
}

export class WebsocketClient extends EventEmitter {
  ws?: WebSocket;
  options?: WebsocketClientOptions;
  authenticated: boolean;
  ping: number;
  pong: number;
  latency: number;
  private timeoutPong: NodeJS.Timeout | undefined;

  constructor(options?: WebsocketClientOptions) {
    super();
    if (options !== undefined) {
      this.options = options;
    }
    this.authenticated = false;
    this.latency = 0;
    this.ping = 0;
    this.pong = 0;
  }

  connect() {
    if (this.ws !== undefined) {
      this.debugMessage('Closing other connection!')
      this.ws.close()
    }
    this.debugMessage('Opening connection of websocket...')
    this.ws = new WebSocket(WebSocketAPI.URL)


    this.ws.on('open', () => {
      this.debugMessage('Connecting RevoltChat...')
      this.authenticated = false;
      if (this.ws !== undefined) {
        const t = {
          type: EventAction.Authenticate,
          result: 'Success',
          token: this.options?.token,
          name: '@uranusjs/revolt (https://github.com/uranusjs/revolt)'
        }
        this.debugMessage(`I'm authenticating with this metadata: ${Buffer.from(JSON.stringify(t)).toString('base64').split('').reverse().join('')}`)
        this.emit('authenticate', t)
        this.sendMessage(t)
      }
    })
    this.ws.on('message', (data) => {

      try {
        const d = JSON.parse(data.toString('utf-8'))
        this.onMessage(d)
      } catch (_) {
        this.debugMessage('this metadata is strange and could not be parsed into JSON.')
        throw new Error('It was not possible to parse this metadata.');
      }
    })
    this.ws.on('close', (code, reason) => {
      clearTimeout(this.timeoutPong);
      this.authenticated = false;
      if (reason !== undefined) {
        try {
          const d = JSON.parse(reason.toString('utf-8'))

          if (d.type !== undefined) {
            switch (d.type) {
              case EventError.AlreadyAuthenticated:
                this.debugMessage('Websocket Error: There is a session connected and could not be established!')
                break;
              case EventError.InternalError:
                this.debugMessage('Websocket Error: An error occurred on the API server')
                break;
              case EventError.InvalidSession:
                this.debugMessage('Websocket Error: Invalid session')
              case EventError.MalformedData:
                this.debugMessage('Websocket Error: Malformed Data!')
              default:
                break;
            }
            return;
          }
        } catch (err) {

        }

      }
      this.debugMessage(`Websocket connection was closed: { code = ${code === undefined ? 'invalid' : code}, reason = ${reason === undefined ? 'noReason' : reason} }`);
      setTimeout(() => {
        this.connect()
        this.debugMessage('Recreating the connection!')
      }, 5 * 1000);
    })
  }

  private debugMessage(message: string) {
    this.emit('debug', message)
  }

  sendMessage(data: any) {
    if (this.ws !== undefined) {
      this.emit('debugSend', data)
      this.ws?.send(JSON.stringify(data))
    }
  }

  onMessage(data: any) {
    this.emit('debugMessage', data)
    if (data.type !== undefined) {
      this.onEvent(data.type, data)
    }
  }

  startPing() {
    setTimeout(() => {
      let t = Date.now()
      this.ping = t
      this.sendMessage({
        type: EventAction.Ping,
        data: t
      })
    }, 1 * 1000);
  }

  onEvent(event: Event, data: any) {
    this.emit(event, data)
    switch (event) {
      case Event.Ready: {
        this.startPing();
      }
        break;
      case Event.Pong: {
        this.timeoutPong = setTimeout(() => {
          this.startPing();
        }, 50 * 1000);
        this.pong = Date.now();
        this.latency = this.pong - this.ping;
      }
        break;
    }
  }
}
