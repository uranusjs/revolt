import type { MessageSort } from '@uranusjs/models-revolt';

export interface OptionsQueryMessages {
  /**
   *  Maximum number of messages to fetch
   * 
   */
  limit: number;
  /**
   * Message id before which messages should be fetched
   */
  before: string;
  /**
   * Message id after which messages should be fetched
   */
  after: string;
  /**
   *  Message sort direction
   */
  sort: MessageSort;
  /**
   *  Message id to search around
   *  Specifying 'nearby' ignores 'before', 'after' and 'sort'.
   *  It will also take half of limit rounded as the limits to each side.
   *  It also fetches the message ID specified.
   */
  nearby: string;
  /**
   *  Whether to include user (and member, if server channel) objects
   */
  includeUsers: boolean;
}

export interface OptionsUnreact {
  /**
   * Remove a specific user's reaction
   */
  user_id?: string;
  /**
   * Remove all reactions
   */
  remove_all: boolean;
}