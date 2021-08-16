export interface ITwitchToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string[];
  token_type: string;
}

export interface ITwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
  created_at: string;
}

export interface ITwitchUsersResponse {
  data: ITwitchUser[];
}

export interface ITwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
}

export interface ITwitchStreamsResponse {
  data: ITwitchStream[];
  pagination: {
    cursor?: string;
  };
}

export interface ITwitchEditor {
  user_id: string;
  user_name: string;
  created_at: string;
}

export interface ITwitchEditorsResponse {
  data: ITwitchEditor[];
}

export interface ITwitchFollow {
  from_id: string;
  from_login: string;
  from_name: string;
  to_id: string;
  to_login: string;
  to_name: string;
  followed_at: string;
}

export interface ITwitchFollowsResponse {
  data: ITwitchFollow[];
  pagination: {
    cursor?: string;
  };
  total: number;
}

export interface ITwitchSubscription {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  gifter_id: string;
  gifter_login: string;
  gifter_name: string;
  is_gift: boolean;
  tier: string;
  plan_name: string;
  user_id: string;
  user_name: string;
  user_login: string;
}

export interface ITwitchSubscriptionsResponse {
  data: ITwitchSubscription[];
  pagination: {
    cursor?: string;
  };
  total: number;
}

export interface ITwitchGame {
  box_art_url: string;
  id: string;
  name: string;
}

export interface ITwitchGamesResponse {
  data: ITwitchGame[];
  pagination: {
    cursor?: string;
  };
}
