export enum Permission {
  /// Manage the channel or channels on the server
  ManageChannel = 1 << 0,
  /// Manage the server
  ManageServer = 1 << 1,
  /// Manage permissions on servers or channels
  ManagePermissions = 1 << 2,
  /// Manage roles on server
  ManageRole = 1 << 3,
  /// Manage server customisation (includes emoji)
  ManageCustomisation = 1 << 4,

  // * Member permissions
  
  /// Kick other members below their ranking
  KickMembers = 1 << 6,
  /// Ban other members below their ranking
  BanMembers = 1 << 7,
  /// Timeout other members below their ranking
  TimeoutMembers = 1 << 8,
  /// Assign roles to members below their ranking
  AssignRoles = 1 << 9,
  /// Change own nickname
  ChangeNickname = 1 << 10,
  /// Change or remove other's nicknames below their ranking
  ManageNicknames = 1 << 11,
  /// Change own avatar
  ChangeAvatar = 1 << 12,
  /// Remove other's avatars below their ranking
  RemoveAvatars = 1 << 13,


  // * Channel permissions

  /// View a channel
  ViewChannel = 1 << 20,
  /// Read a channel's past message history
  ReadMessageHistory = 1 << 21,
  /// Send a message in a channel
  SendMessage = 1 << 22,
  /// Delete messages in a channel
  ManageMessages = 1 << 23,
  /// Manage webhook entries on a channel
  ManageWebhooks = 1 << 24,
  /// Create invites to this channel
  InviteOthers = 1 << 25,
  /// Send embedded content in this channel
  SendEmbeds = 1 << 26,
  /// Send attachments and media in this channel
  UploadFiles = 1 << 27,
  /// Masquerade messages using custom nickname and avatar
  Masquerade = 1 << 28,
  /// React to messages with emojis
  React = 1 << 29,

  // * Voice permissions
  /// Connect to a voice channel
  Connect = 1 << 30,
  /// Speak in a voice call
  Speak = 1 << 31,
  /// Share video in a voice call
  Video = 1 << 32,
  /// Mute other members with lower ranking in a voice call
  MuteMembers = 1 << 33,
  /// Deafen other members with lower ranking in a voice call
  DeafenMembers = 1 << 34,
  /// Move members between voice channels
  MoveMembers = 1 << 35,
}


export enum UserPermission { 
  Access = 1 << 0,
  ViewProfile = 1 << 1,
  SendMessage = 1 << 2,
  Invite = 1 << 3
}