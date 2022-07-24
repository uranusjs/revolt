export enum BotFlags {
  Verified = 1,
  Official = 2
}

export enum FieldsBot {
  Token,
  InteractionsURL
}

export interface BotStruct {
  _id: string;
  owner: string;
  token: string;
  public: boolean;
  analytics: boolean;
  discoverable: boolean;
  interactions_url?: string;
  terms_of_service_url?: string;
  privacy_policy_url?: string;
  flags?: number;
}