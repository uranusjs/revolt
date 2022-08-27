import type { TextChannel } from '../../entity/Channel';

export class TextChannelAction {
  data?: any;
  base?: TextChannel;
  constructor(data: any, base: TextChannel) {
    this.data = data;
    this.base = base;
  }


  delete() { }

  
}