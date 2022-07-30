import type * as Metadata from './metadata/channels/channelMetadata';
import type { OptionsQueryMessages } from './query/channels/channelQuery';
import { MethodRequest, NoRequired, Route } from './Route';

export const UsersRoute = {
  FETCH_USER: new Route(MethodRequest.GET, '/users/{target}/profile'),
  FETCH_DM: new Route(MethodRequest.GET, '/users/{dm}'),
}

export const ChannelsRoute = {
  CHANNEL_DELETE: (id: string) =>
    new Route<NoRequired>(MethodRequest.DELETE, `/channels/${id}`),
  CHANNEL_EDIT: (id: string) =>
    new Route<Metadata.DataEditChannel>(MethodRequest.PATCH, `/channels/${id}`),
  CHANNEL_FETCH: (id: string) =>
    new Route<NoRequired>(MethodRequest.GET, `/channels/${id}`),

  MESSAGE_BULK_DELETE: (id: string) =>
    new Route<Metadata.OptionsBulkDelete>(MethodRequest.DELETE, `/channels/${id}/messages/bulk`),
  MESSAGE_CLEAR_REACTIONS: (channelId: string, id: string) =>
    new Route<NoRequired>(MethodRequest.DELETE, `/channels/${channelId}/messages/${id}/reactions`),
  MESSAGE_DELETE: (channelId: string, messageId: string) =>
    new Route<NoRequired>(MethodRequest.DELETE, `/channels/${channelId}/messages/${messageId}`),
  MESSAGE_EDIT: (channelId: string, messageId: string) =>
    new Route<Metadata.DataEditMessage>(MethodRequest.PATCH, `/channels/${channelId}/messages/${messageId}`),
  MESSAGE_FETCH: (channelId: string, messageId: string) =>
    new Route<NoRequired>(MethodRequest.GET, `/channels/${channelId}/messages/${messageId}`),
  MESSAGE_QUERY: (channelId: string, messageId: string, optionsQuery: OptionsQueryMessages) =>
    new Route<NoRequired>(MethodRequest.GET, `/channels/${channelId}/messages/${messageId}?limit=${optionsQuery.limit}&before=${optionsQuery.before}&after=${optionsQuery.after}&sort=${optionsQuery.sort}&nearby=${optionsQuery.nearby}&includeUsers=${optionsQuery.includeUsers}`),
  
}
