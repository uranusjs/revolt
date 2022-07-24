export const Models = {
  Channels: {
    Channel: import('./models/channels/channel'),
    ChannelInvite: import('./models/channels/channelInvite'),
    ChannelUnread: import('./models/channels/channelUnread'),
    Message: import('./models/channels/message'),
  },

  Media: {
    Attachment: import('./models/media/attachment'),
    Emoji: import('./models/media/emoji'),
  },

  Servers: {
    Server: import('./models/servers/server'),
    Emoji: import('./models/servers/serverMember'),
  },

  Users: {
    Bot: import('./models/users/bot'),
    User: import('./models/users/user'),
  },

}

export const Permissions = {
  Permission: import('./permissions/permission'),
}

export const Embeds = {
  Embed: import('./embeds/embed'),
  Media: import('./embeds/media'),
  Special: import('./embeds/special'),
}