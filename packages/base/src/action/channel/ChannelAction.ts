import { RequestActionData } from 'action/RequestActionData';
import type { TextChannel } from '../../entity/Channel';

export class TextChannelActionData {
    channelType!: string;
    description!: string;
    name!: string;
    server!: string;
    _id!: string;
    originalData: TextChannel;
    private action: TextChannelAction;

    constructor(data: any, textChannel: TextChannel, action: RequestActionData) {
        if (data.channel_type !== undefined) {
            this.channelType = data.channel_type;
        }
        if (data.description !== undefined) {
            this.description = data.description;
        }
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.server !== undefined) {
            this.server = data.server;
        }
        if (data.server !== undefined) {
            this.server = data.server;
        }
        if (data._id !== undefined) {
            this._id = data._id;
        }
        this.originalData = textChannel;
        this.action = action;
    }
    

    get getAction() {
        return this.action;
    }


}

export class TextChannelAction extends RequestActionData {
    data?: any;
    base?: TextChannel;
  
    constructor(data: any, base: TextChannel) {
        super();
        this.data = data;
        this.base = base;
    }


    // eslint-disable-next-line @typescript-eslint/ban-types
    queue(_data: Promise<void> | Function | any): void {
        throw new Error('Method not implemented.');
        
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    async asyncQueue(_data: Promise<void> | Function | any): Promise<void> {
        throw new Error('Method not implemented.');
    }


    private manageRequestData() {
        if (this.data == undefined) return this.error('I received invalid data!');
        if (this.base == undefined) return this.error('The base is not recognized!');
      

    }
  

    private error(message: string) {
        throw new Error(message)
    }
    


    static ge(data: any, base: TextChannel) {
        return new TextChannelAction(data, base)
    }
  
}