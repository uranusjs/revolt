import type * as Metadata from './metadata/channels/channelMetadata';
import { MethodRequest, NoRequired, Route } from './Route';

export const UsersRoute = {
  FETCH_USER: new Route(MethodRequest.GET, '/users/{target}/profile'),
  FETCH_DM: new Route(MethodRequest.GET, '/users/{dm}'),
}

export const ChannelsRoute = {
  CHANNEL_DELETE: new Route<NoRequired>(MethodRequest.DELETE, '/channels/{id}'),
  CHANNEL_EDIT: new Route<Metadata.DataEditChannel>(MethodRequest.PATCH, '/channels/{id}'),
  CHANNEL_FETCH: new Route<NoRequired>(MethodRequest.GET, '/channels/{id}'),

  MESSAGE_BULK_DELETE: new Route<Metadata.OptionsBulkDelete>(MethodRequest.DELETE, '/channels/{id}/messages/bulk'),
  MESSAGE_CLEAR_REACTIONS: new Route<NoRequired>(MethodRequest.DELETE, '/channels/{id}/messages/{msg}/reactions'),
  MESSAGE_DELETE: new Route<Metadata.DataEditMessage>(MethodRequest.PATCH, '/channels/{id}/messages/{msg}'),
}
