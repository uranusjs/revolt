import { TextChannel, VoiceChannel } from '../../entity/Channel';
import type { RevoltClient } from '../../RevoltBase';
import { DataPackage } from '../DataStorage';
import { ChannelData } from '../structures/ChannelData';

enum ChannelTypes {
  TextChannel = 'TextChannel',
  VoiceChannel = 'VoiceChannel'
}

export function handleReady(data: any, revoltClient: RevoltClient) {
    if (data.channels !== undefined) {
        for (const channel of data.channels) {
            switch (channel.channel_type) {
            case ChannelTypes.TextChannel:
                revoltClient.cacheManager.channels.add({
                    'id': channel._id,
                    'data': new DataPackage(new TextChannel(revoltClient.restClient, new ChannelData(channel)), 0),
                    'ttl': 0,
                    'requireTTL': false,
                });
                break;
            case ChannelTypes.VoiceChannel:

                revoltClient.cacheManager.channels.add({
                    'id': channel._id,
                    'data': new DataPackage(new VoiceChannel(revoltClient.restClient, new ChannelData(channel)), 0),
                    'ttl': 0,
                    'requireTTL': false,
                });
                break;

            default:
                break;
            }
        }
    }
}
