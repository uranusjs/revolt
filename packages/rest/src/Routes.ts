import { DataEditChannel } from './metadata/channels/channelMetadata';
import { MethodRequest, NoRequired, Route } from './Route';

export const UsersRoute = {
  FETCH_USER: new Route(MethodRequest.GET, '/users/{target}/profile'),
  FETCH_DM: new Route(MethodRequest.GET, '/users/{dm}'),
}

export const ChannelsRoute = {
  CHANNEL_DELETE: new Route<NoRequired>(MethodRequest.DELETE, '/channels/{id}'),
  CHANNEL_EDIT: new Route<DataEditChannel>(MethodRequest.DELETE, '/channels/{id}'),
}

