import type * as MetadataChannel from './metadata/channels/channelMetadata';
import type * as MetadataServer from './metadata/servers/serverMetadata';
import type { MessageUnreactOptions } from './options/channels/channelOptions';
import type { OptionsFetchAllMembers } from './options/servers/serverOptions';
import type { OptionsQueryMessages } from './query/channels/channelQuery';
import { MethodRequest, NoRequired, Route, RoutePath } from './Route';

export const UsersRoute = {
  FETCH_USER: (target: string) => new Route(MethodRequest.GET, `/users/${target}/profile`),
  FETCH_DM: (dm: string) => new Route(MethodRequest.GET, `/users/${dm}`),
}

export const ChannelsRoute = {
  CHANNEL_DELETE: (id: string) =>
    new Route<NoRequired, RoutePath.CHANNELS>(MethodRequest.DELETE, `/channels/${id}`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}'
    }),
  CHANNEL_EDIT: (id: string) =>
    new Route<MetadataChannel.DataEditChannel, RoutePath.CHANNELS>(MethodRequest.PATCH, `/channels/${id}`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}'
    }),
  CHANNEL_FETCH: (id: string) =>
    new Route<NoRequired, RoutePath.CHANNELS>(MethodRequest.GET, `/channels/${id}`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}'
    }),

  MESSAGE_SEND: (id: string) => new Route<MetadataChannel.OptionsBulkDelete, RoutePath.CHANNELS>(MethodRequest.POST, `/channels/${id}/messages`, {
    route: RoutePath.CHANNELS,
    template: '/channels/{id}/messages'
  }),
  MESSAGE_BULK_DELETE: (id: string) =>
    new Route<MetadataChannel.OptionsBulkDelete, RoutePath.CHANNELS>(MethodRequest.DELETE, `/channels/${id}/messages/bulk`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/messages/bulk'
    }),
  MESSAGE_CLEAR_REACTIONS: (channelId: string, id: string) =>
    new Route<NoRequired, RoutePath.CHANNELS>(MethodRequest.DELETE, `/channels/${channelId}/messages/${id}/reactions`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/messages/{id}/reactions'
    }),
  MESSAGE_DELETE: (channelId: string, messageId: string) =>
    new Route<NoRequired, RoutePath.CHANNELS>(MethodRequest.DELETE, `/channels/${channelId}/messages/${messageId}`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/messages/{id}'
    }),
  MESSAGE_EDIT: (channelId: string, messageId: string) =>
    new Route<MetadataChannel.DataEditMessage, RoutePath.CHANNELS>(MethodRequest.PATCH, `/channels/${channelId}/messages/${messageId}`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/messages/{id}'
    }),
  MESSAGE_FETCH: (channelId: string, messageId: string) =>
    new Route<NoRequired, RoutePath.CHANNELS>(MethodRequest.GET, `/channels/${channelId}/messages/${messageId}`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/messages/{id}'
    }),
  MESSAGE_QUERY: (channelId: string, messageId: string, optionsQuery: OptionsQueryMessages) =>
    new Route<NoRequired, RoutePath.CHANNELS>(MethodRequest.GET, `/channels/${channelId}/messages/${messageId}?limit=${optionsQuery.limit}&before=${optionsQuery.before}&after=${optionsQuery.after}&sort=${optionsQuery.sort}&nearby=${optionsQuery.nearby}&includeUsers=${optionsQuery.includeUsers}`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/messages/{id}?limit={:limit-number}&before={:before-number}&after={:after-number}'
    }),
  MESSAGE_REACT: (channelId: string, messageId: string, emoji: string) =>
    new Route<NoRequired, RoutePath.CHANNELS>(MethodRequest.POST, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/messages/{id}/reactions/{emoji}'
    }),
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
    return new Route<NoRequired, RoutePath.CHANNELS>(MethodRequest.DELETE, `/channels/${channelId}/messages/${messageId}/reactions/${emoji}?${optionQuery.join('&')}`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/messages/{id}/reactions/emoji?user-id={id}&remove_all={remove-all}'
    })
  },


  PERMISSIONS_SET: (channelId: string, roleId: string) =>
    new Route<MetadataChannel.DataRoleChannel, RoutePath.CHANNELS>(MethodRequest.PUT, `/channels/${channelId}/permissions/${roleId}`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/permissions/{role-id}'
    }),
  PERMISSIONS_SET_DEFAULT: (channelId: string) =>
    new Route<NoRequired, RoutePath.CHANNELS>(MethodRequest.PUT, `/channels/${channelId}/permissions/default`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/permissions/default'
    }),


  VOICE_JOIN: (channelId: string) =>
    new Route<MetadataChannel.CreateVoiceUserResponse, RoutePath.CHANNELS>(MethodRequest.PUT, `/channels/${channelId}/join_call`, {
      route: RoutePath.CHANNELS,
      template: '/channels/{id}/join_call'
    }),
}


export const ServersRoute = {
  BAN_CREATE: (serverId: string, userId: string) =>
    new Route<MetadataServer.DataBanCreate, RoutePath.SERVERS>(MethodRequest.PUT, `/servers/${serverId}/bans/${userId}`, {
      route: RoutePath.SERVERS
    }),
  BAN_LIST: (serverId: string) =>
    new Route<NoRequired, RoutePath.SERVERS>(MethodRequest.PUT, `/servers/${serverId}/bans`, {
      route: RoutePath.SERVERS
    }),
  BAN_REMOVE: (serverId: string, userId: string) =>
    new Route<NoRequired, RoutePath.SERVERS>(MethodRequest.DELETE, `/servers/${serverId}/bans/${userId}`, {
      route: RoutePath.SERVERS
    }),


  CHANNEL_CREATE: (serverId: string) =>
    new Route<MetadataServer.DataCreateChannel, RoutePath.SERVERS>(MethodRequest.POST, `/servers/${serverId}/channels`, {
      route: RoutePath.SERVERS
    }),


  EMOJI_LIST: (serverId: string) =>
    new Route<NoRequired, RoutePath.SERVERS>(MethodRequest.GET, `/servers/${serverId}/emojis`, {
      route: RoutePath.SERVERS
    }),


  MEMBER_EDIT: (serverId: string, memberId: string) =>
    new Route<MetadataServer.DataMemberEdit, RoutePath.SERVERS>(MethodRequest.PATCH, `/servers/${serverId}/members/${memberId}`, {
      route: RoutePath.SERVERS
    }),
  MEMBER_FETCH: (serverId: string, memberId: string) =>
    new Route<NoRequired, RoutePath.SERVERS>(MethodRequest.GET, `/servers/${serverId}/members/${memberId}`, {
      route: RoutePath.SERVERS
    }),
  MEMBER_FETCH_ALL: (serverId: string, memberId: string, options?: OptionsFetchAllMembers) => {
    let optionQuery: string[] = []
    if (options !== undefined && options !== null) {
      if (options.exclude_offline !== undefined) {
        optionQuery.push(`exclude_offline=${options.exclude_offline}`)
      }
    }

    return new Route<NoRequired, RoutePath.SERVERS>(MethodRequest.GET, `/servers/${serverId}/members/${memberId}`, {
      route: RoutePath.SERVERS
    })
  },
  MEMBER_REMOVE: (serverId: string, memberId: string) =>
    new Route<NoRequired, RoutePath.SERVERS>(MethodRequest.DELETE, `/servers/${serverId}/members/${memberId}`, {
      route: RoutePath.SERVERS
    }),


  PERMISSIONS_SET: (serverId: string, roleId: string) =>
    new Route<MetadataServer.DataRoleServer, RoutePath.SERVERS>(MethodRequest.PUT, `/servers/${serverId}/permissions/${roleId}`, {
      route: RoutePath.SERVERS
    }),
  PERMISSIONS_SET_DEFAULT: (serverId: string) =>
    new Route<MetadataServer.DataSetServerDefaultPermission, RoutePath.SERVERS>(MethodRequest.PUT, `/servers/${serverId}/permissions/default`, {
      route: RoutePath.SERVERS
    }),


  ROLES_CREATE: (serverId: string) =>
    new Route<MetadataServer.DataCreateRole, RoutePath.SERVERS>(MethodRequest.POST, `/servers/${serverId}/roles`, {
      route: RoutePath.SERVERS
    }),
  ROLES_DELETE: (serverId: string, roleId: string) =>
    new Route<MetadataServer.DataCreateRole, RoutePath.SERVERS>(MethodRequest.DELETE, `/servers/${serverId}/roles/${roleId}`, {
      route: RoutePath.SERVERS
    }),
  ROLES_EDIT: (serverId: string, roleId: string) =>
    new Route<MetadataServer.DataEditRole, RoutePath.SERVERS>(MethodRequest.PATCH, `/servers/${serverId}/roles/${roleId}`, {
      route: RoutePath.SERVERS
    }),

  SERVER_CREATE: () =>
    new Route<MetadataServer.DataCreateServer, RoutePath.SERVERS>(MethodRequest.PATCH, `/servers/create`, {
      route: RoutePath.SERVERS
    }),
  SERVER_DELETE: (serverId: string) =>
    new Route<NoRequired, RoutePath.SERVERS>(MethodRequest.DELETE, `/servers/${serverId}`, {
      route: RoutePath.SERVERS
    }),
  SERVER_EDIT: (serverId: string) =>
    new Route<MetadataServer.DataEditServer, RoutePath.SERVERS>(MethodRequest.PATCH, `/servers/${serverId}`, {
      route: RoutePath.SERVERS
    }),
  SERVER_GET: (serverId: string) =>
    new Route<NoRequired, RoutePath.SERVERS>(MethodRequest.GET, `/servers/${serverId}`, {
      route: RoutePath.SERVERS
    }),
}

export const Customisation = {
  EMOJI_FETCH: (id: string) =>
    new Route<NoRequired, RoutePath.CUSTOM>(MethodRequest.GET, `/custom/${id}`, {
      route: RoutePath.CUSTOM
    }),
}

export const Invites = {
  INVITE_FETCH: (id: string) =>
    new Route<NoRequired, RoutePath.INVITES>(MethodRequest.GET, `/invites/${id}`, {
      route: RoutePath.INVITES
    }),
}