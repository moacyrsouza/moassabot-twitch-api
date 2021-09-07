import axios, { AxiosInstance } from 'axios';
import { URLSearchParams } from 'url';
import {
  ITwitchToken,
  ITwitchUser,
  ITwitchUsersResponse,
  ITwitchStream,
  ITwitchStreamsResponse,
  ITwitchEditor,
  ITwitchEditorsResponse,
  ITwitchFollow,
  ITwitchFollowsResponse,
  ITwitchSubscription,
  ITwitchSubscriptionsResponse,
  ITwitchGamesResponse,
} from './types';

const chunk_size = 100;

export default class TwitchAPI {
  _helix: AxiosInstance;
  _auth: AxiosInstance;

  private client_id: string;
  private client_secret: string;

  constructor(client_id: string, client_secret: string) {
    this.client_id = client_id;
    this.client_secret = client_secret;

    this._auth = axios.create({
      baseURL: 'https://id.twitch.tv/oauth2',
    });

    this._helix = axios.create({
      baseURL: 'https://api.twitch.tv/helix',
      headers: {
        'Client-ID': client_id,
      },
    });

    this._auth.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        throw error.response.data;
      }
    );

    this._helix.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        throw error.response.data;
      }
    );
  }

  getAccessToken = ({ code, redirect_uri }: { code: string; redirect_uri: string }): Promise<ITwitchToken> => {
    return new Promise(async (resolve, reject) => {
      try {
        const qs = new URLSearchParams({
          client_id: this.client_id,
          client_secret: this.client_secret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri,
        });

        const response: ITwitchToken = await this._auth.post(`/token?${qs}`);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  };

  refreshAccessToken = (refresh_token: string): Promise<ITwitchToken> => {
    return new Promise(async (resolve, reject) => {
      try {
        const qs = new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token,
          client_id: this.client_id,
          client_secret: this.client_secret,
        });

        const response: ITwitchToken = await this._auth.post(`/token?${qs}`);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  };

  getAppAccessToken = (scopes: string): Promise<ITwitchToken> => {
    return new Promise(async (resolve, reject) => {
      try {
        const qs = new URLSearchParams({
          client_id: this.client_id,
          client_secret: this.client_secret,
          scope: scopes,
          grant_type: 'client_credentials',
        });

        const response: ITwitchToken = await this._auth.post(`/token?${qs}`);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  };

  getUser = async ({ twitch_access_token }: { twitch_access_token: string }): Promise<ITwitchUser> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response: ITwitchUsersResponse = await this._helix.get(`/users`, {
          headers: {
            Authorization: `Bearer ${twitch_access_token}`,
          },
        });
        resolve(response.data[0]);
      } catch (err) {
        reject(err);
      }
    });
  };

  getUsers = async ({
    ids = [],
    twitch_access_token,
  }: {
    ids: string[];
    twitch_access_token: string;
  }): Promise<ITwitchUser[]> => {
    return new Promise(async (resolve, reject) => {
      if (ids.length === 0) resolve([]);

      let result: ITwitchUser[] = [];
      try {
        for (let i = 0; i < ids.length; i += chunk_size) {
          const chunk = ids.slice(i, i + chunk_size);

          const qs = new URLSearchParams({
            first: String(chunk_size),
          });
          chunk.forEach((id: string) => qs.append('id', id));

          const response: ITwitchUsersResponse = await this._helix.get(`/users?${qs}`, {
            headers: {
              Authorization: `Bearer ${twitch_access_token}`,
            },
          });

          result = [...result, ...response.data];
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  };

  getStream = async ({
    id: user_id,
    twitch_access_token,
  }: {
    id: string;
    twitch_access_token: string;
  }): Promise<ITwitchStream> => {
    return new Promise(async (resolve, reject) => {
      try {
        const qs = new URLSearchParams({ user_id });

        const response: ITwitchStreamsResponse = await this._helix.get(`/streams?${qs}`, {
          headers: {
            Authorization: `Bearer ${twitch_access_token}`,
          },
        });

        resolve(response.data[0]);
      } catch (err) {
        reject(err);
      }
    });
  };

  getStreams = async ({
    ids = [],
    twitch_access_token,
  }: {
    ids: string[];
    twitch_access_token: string;
  }): Promise<ITwitchStream[]> => {
    return new Promise(async (resolve, reject) => {
      if (ids.length === 0) resolve([]);

      let result: ITwitchStream[] = [];
      try {
        for (let i = 0; i < ids.length; i += chunk_size) {
          const chunk = ids.slice(i, i + chunk_size);

          const qs = new URLSearchParams({
            first: String(chunk_size),
          });
          chunk.forEach((id: string) => qs.append('id', id));

          const response: ITwitchStreamsResponse = await this._helix.get(`/streams?${qs}`, {
            headers: {
              Authorization: `Bearer ${twitch_access_token}`,
            },
          });

          result = [...result, ...response.data];
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  };

  getEditors = async ({
    id: broadcaster_id,
    twitch_access_token,
  }: {
    id: string;
    twitch_access_token: string;
  }): Promise<ITwitchEditor[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const qs = new URLSearchParams({
          broadcaster_id,
        });

        const response: ITwitchEditorsResponse = await this._helix.get(`/channels/editors?${qs}`, {
          headers: {
            Authorziation: `Bearer ${twitch_access_token}`,
          },
        });

        resolve(response.data);
      } catch (err) {
        reject(err);
      }
    });
  };

  getFollows = async ({
    twitch_access_token,
    channel_id: to_id,
    user_id: from_id,
  }: {
    twitch_access_token: string;
    channel_id?: string;
    user_id?: string;
  }): Promise<ITwitchFollow[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const params =
          to_id && from_id
            ? { first: String(chunk_size), to_id, from_id }
            : to_id
            ? { first: String(chunk_size), to_id }
            : { first: String(chunk_size), from_id };
        const result: ITwitchFollow[] = [];

        let qs = new URLSearchParams(params);
        let exit = false;

        while (!exit) {
          const response: ITwitchFollowsResponse = await this._helix.get(`/users/follows?${qs}`, {
            headers: {
              Authorization: `Bearer ${twitch_access_token}`,
            },
          });

          result.push(...response.data);
          if (response.total === 0 || !response.pagination.cursor) {
            exit = true;
          } else {
            qs = new URLSearchParams({ ...params, after: response.pagination.cursor });
          }
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  };

  getSubscriptions = async ({
    id: broadcaster_id,
    twitch_access_token,
  }: {
    id: string;
    twitch_access_token: string;
  }): Promise<ITwitchSubscription[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const params = { first: String(chunk_size), broadcaster_id };
        const result: ITwitchSubscription[] = [];

        let qs = new URLSearchParams(params);
        let exit = false;

        while (!exit) {
          const response: ITwitchSubscriptionsResponse = await this._helix.get(`/subscriptions?${qs}`, {
            headers: {
              Authorization: `Bearer ${twitch_access_token}`,
            },
          });

          result.push(...response.data);
          if (response.total === 0 || !response.pagination.cursor) {
            exit = true;
          } else {
            qs = new URLSearchParams({ ...params, after: response.pagination.cursor });
          }
        }

        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  };

  setTitle = async ({
    title,
    twitch_access_token,
    broadcaster_id,
  }: {
    title: string;
    twitch_access_token: string;
    broadcaster_id: string;
  }): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const qs = new URLSearchParams({
          broadcaster_id,
        });

        await this._helix.patch(
          `/channels?${qs}`,
          { title },
          {
            headers: {
              Authorization: `Bearer ${twitch_access_token}`,
            },
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  setGame = async ({
    game: name,
    twitch_access_token,
    broadcaster_id,
  }: {
    game: string;
    twitch_access_token: string;
    broadcaster_id: string;
  }): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        let game_id = '';

        if (name.length === 0) {
          const response: ITwitchGamesResponse = await this._helix.get(`/games?name=${name}`, {
            headers: {
              Authorization: `Bearer ${twitch_access_token}`,
            },
          });

          if (response.data.length === 0) {
            const error = new Error(
              `Não foi possível atualizar a categoria da transmissão para ${name}. Categoria não encontrada.`
            );
            // error.reply = true;
            throw error;
          }

          game_id = response.data[0].id;
        }

        await this._helix.patch(
          `/channels?broadcaster_id=${broadcaster_id}`,
          {
            game_id,
          },
          {
            headers: {
              Authorization: `Bearer ${twitch_access_token}`,
            },
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  };
}
