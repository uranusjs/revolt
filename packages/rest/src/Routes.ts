import type * as MetadataChannel from './metadata/channels/channelMetadata';
import type * as MetadataServer from './metadata/servers/serverMetadata';
import type { MessageUnreactOptions } from './options/channels/channelOptions';
import type { OptionsFetchAllMembers } from './options/servers/serverOptions';
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
    new Route<MetadataChannel.DataEditChannel>(MethodRequest.PATCH, `/channels/${id}`),
  CHANNEL_FETCH: (id: string) =>
    new Route<NoRequired>(MethodRequest.GET, `/channels/${id}`),


  MESSAGE_BULK_DELETE: (id: string) =>
    new Route<MetadataChannel.OptionsBulkDelete>(MethodRequest.DELETE, `/channels/${id}/messages/bulk`),
  MESSAGE_CLEAR_REACTIONS: (channelId: string, id: string) =>
    new Route<NoRequired>(MethodRequest.DELETE, `/channels/${channelId}/messages/${id}/reactions`),
  MESSAGE_DELETE: (channelId: string, messageId: string) =>
    new Route<NoRequired>(MethodRequest.DELETE, `/channels/${channelId}/messages/${messageId}`),
  MESSAGE_EDIT: (channelId: string, messageId: string) =>
    new Route<MetadataChannel.DataEditMessage>(MethodRequest.PATCH, `/channels/${channelId}/messages/${messageId}`),
  MESSAGE_FETCH: (channelId: string, messageId: string) =>
    new Route<NoRequired>(MethodRequest.GET, `/channels/${channelId}/messages/${messageId}`),
  MESSAGE_QUERY: (channelId: string, messageId: string, optionsQuery: OptionsQueryMessages) =>
    new Route<NoRequired>(MethodRequest.GET, `/channels/${channelId}/messages/${messageId}?limit=${optionsQuery.limit}&before=${optionsQuery.before}&after=${optionsQuery.after}&sort=${optionsQuery.sort}&nearby=${optionsQuery.nearby}&includeUsers=${optionsQuery.includeUsers}`),
  MESSAGE_REACT: (channelId: string, messageId: string, emoji: string) =>
    new Route<NoRequired>(MethodRequest.POST, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`),
  MESSAGE_UNREACT: (channelId: string, messageId: string, options?: MessageUnreactOptions) => {
    let optionQuery: string[] = []
    let emoji = ''
    if (options !== undefined && options !== null) {
      if (options.emoji !== undefined) {
        emoji = options.emoji
      }
      if (options.extendOptions !== undefined) {
        if (options.extendOptions.user_id !== undefined) {
          optionQuery.push(`user_id=${options.extendOptions.user_id}`)
        }

        if (options.extendOptions.remove_all !== undefined) {
          optionQuery.push(`remove_all=${options.extendOptions.remove_all}`)
        }
      }
    }
    return new Route<NoRequired>(MethodRequest.DELETE, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}?${optionQuery.join('&')}`)
  },


  PERMISSIONS_SET: (channelId: string, roleId: string) =>
    new Route<MetadataChannel.DataRoleChannel>(MethodRequest.PUT, `/channels/${channelId}/permissions/${roleId}`),
  PERMISSIONS_SET_DEFAULT: (channelId: string) =>
    new Route<NoRequired>(MethodRequest.PUT, `/channels/${channelId}/permissions/default`),


  VOICE_JOIN: (channelId: string) =>
    new Route<MetadataChannel.CreateVoiceUserResponse>(MethodRequest.PUT, `/channels/${channelId}/join_call`),
}


export const ServersRoute = {
  BAN_CREATE: (serverId: string, userId: string) =>
    new Route<MetadataServer.DataBanCreate>(MethodRequest.PUT, `/servers/${serverId}/bans/${userId}`),
  BAN_LIST: (serverId: string) =>
    new Route<NoRequired>(MethodRequest.PUT, `/servers/${serverId}/bans`),
  BAN_REMOVE: (serverId: string, userId: string) =>
    new Route<NoRequired>(MethodRequest.DELETE, `/servers/${serverId}/bans/${userId}`),


  CHANNEL_CREATE: (serverId: string) =>
    new Route<MetadataServer.DataCreateChannel>(MethodRequest.POST, `/servers/${serverId}/channels`),


  EMOJI_LIST: (serverId: string) =>
    new Route<NoRequired>(MethodRequest.GET, `/servers/${serverId}/emojis`),


  MEMBER_EDIT: (serverId: string, memberId: string) =>
    new Route<MetadataServer.DataMemberEdit>(MethodRequest.PATCH, `/servers/${serverId}/members/${memberId}`),
  MEMBER_FETCH: (serverId: string, memberId: string) =>
    new Route<NoRequired>(MethodRequest.GET, `/servers/${serverId}/members/${memberId}`),
  MEMBER_FETCH_ALL: (serverId: string, memberId: string, options?: OptionsFetchAllMembers) => {
    let optionQuery: string[] = []
    if (options !== undefined && options !== null) {
      if (options.exclude_offline !== undefined) {
        optionQuery.push(`exclude_offline=${options.exclude_offline}`)
      }
    }
    
    return new Route<NoRequired>(MethodRequest.GET, `/servers/${serverId}/members/${memberId}`)
  },
  MEMBER_REMOVE: (serverId: string, memberId: string) =>
    new Route<NoRequired>(MethodRequest.DELETE, `/servers/${serverId}/members/${memberId}`),
  
  
  PERMISSIONS_SET: (serverId: string, roleId: string) =>
    new Route<MetadataServer.DataRoleServer>(MethodRequest.PUT, `/servers/${serverId}/permissions/${roleId}`),
  PERMISSIONS_SET_DEFAULT: (serverId: string) =>
    new Route<MetadataServer.DataSetServerDefaultPermission>(MethodRequest.PUT, `/servers/${serverId}/permissions/default`),


  ROLES_CREATE: (serverId: string) => 
    new Route<MetadataServer.DataCreateRole>(MethodRequest.POST, `/servers/${serverId}/roles`),
  ROLES_DELETE: (serverId: string, roleId: string) =>
    new Route<MetadataServer.DataCreateRole>(MethodRequest.DELETE, `/servers/${serverId}/roles/${roleId}`),
  ROLES_EDIT: (serverId: string, roleId: string) =>
    new Route<MetadataServer.DataEditRole>(MethodRequest.PATCH, `/servers/${serverId}/roles/${roleId}`),
  
  SERVER_CREATE: () =>
    new Route<MetadataServer.DataCreateServer>(MethodRequest.PATCH, `/servers/create`),
  SERVER_DELETE: (serverId: string) =>
    new Route<NoRequired>(MethodRequest.DELETE, `/servers/${serverId}`),
  SERVER_EDIT: (serverId: string) =>
    new Route<MetadataServer.DataEditServer>(MethodRequest.PATCH, `/servers/${serverId}`),
  SERVER_GET: (serverId: string) =>
    new Route<NoRequired>(MethodRequest.GET, `/servers/${serverId}`),
  
}
