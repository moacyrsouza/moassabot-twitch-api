import 'dotenv/config';
import axios from 'axios';
import { URLSearchParams } from 'url';
import {
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

const API = axios.create({
  baseURL: 'https://api.twitch.tv/helix',
  headers: {
    'Client-ID': process.env.TWITCH_CLIENT_ID,
  },
});

API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    throw error.response.data;
  }
);

export const getUser = async ({ twitch_access_token }: { twitch_access_token: string }): Promise<ITwitchUser> => {
  try {
    const response: ITwitchUsersResponse = await API.get(`/users`, {
      headers: {
        Authorization: `Bearer ${twitch_access_token}`,
      },
    });
    return response.data[0];
  } catch (err) {
    throw err;
  }
};

export const getUsers = async ({
  ids = [],
  twitch_access_token,
}: {
  ids: string[];
  twitch_access_token: string;
}): Promise<ITwitchUser[]> => {
  if (ids.length === 0) return [];

  let result: ITwitchUser[] = [];
  try {
    for (let i = 0; i < ids.length; i += chunk_size) {
      const chunk = ids.slice(i, i + chunk_size);

      const qs = new URLSearchParams({
        first: String(chunk_size),
      });
      chunk.forEach((id: string) => qs.append('id', id));

      const response: ITwitchUsersResponse = await API.get(`/users?${qs}`, {
        headers: {
          Authorization: `Bearer ${twitch_access_token}`,
        },
      });

      result = [...result, ...response.data];
    }

    return result;
  } catch (err) {
    throw err;
  }
};

export const getStream = async ({
  id: user_id,
  twitch_access_token,
}: {
  id: string;
  twitch_access_token: string;
}): Promise<ITwitchStream> => {
  try {
    const qs = new URLSearchParams({ user_id });

    const response: ITwitchStreamsResponse = await API.get(`/streams?${qs}`, {
      headers: {
        Authorization: `Bearer ${twitch_access_token}`,
      },
    });

    return response.data[0];
  } catch (err) {
    throw err;
  }
};

export const getStreams = async ({
  ids = [],
  twitch_access_token,
}: {
  ids: string[];
  twitch_access_token: string;
}): Promise<ITwitchStream[]> => {
  if (ids.length === 0) return [];

  let result: ITwitchStream[] = [];
  try {
    for (let i = 0; i < ids.length; i += chunk_size) {
      const chunk = ids.slice(i, i + chunk_size);

      const qs = new URLSearchParams({
        first: String(chunk_size),
      });
      chunk.forEach((id: string) => qs.append('id', id));

      const response: ITwitchStreamsResponse = await API.get(`/streams?${qs}`, {
        headers: {
          Authorization: `Bearer ${twitch_access_token}`,
        },
      });

      result = [...result, ...response.data];
    }

    return result;
  } catch (err) {
    throw err;
  }
};

export const getEditors = async ({
  id: broadcaster_id,
  twitch_access_token,
}: {
  id: string;
  twitch_access_token: string;
}): Promise<ITwitchEditor[]> => {
  try {
    const qs = new URLSearchParams({
      broadcaster_id,
    });

    const response: ITwitchEditorsResponse = await API.get(`/channels/editors?${qs}`, {
      headers: {
        Authorziation: `Bearer ${twitch_access_token}`,
      },
    });

    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getFollows = async ({
  twitch_access_token,
  channel_id: to_id,
  user_id: from_id,
}: {
  twitch_access_token: string;
  channel_id?: string;
  user_id?: string;
}): Promise<ITwitchFollow[]> => {
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
      const response: ITwitchFollowsResponse = await API.get(`/users/follows?${qs}`, {
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

    return result;
  } catch (err) {
    throw err;
  }
};

export const getSubscriptions = async ({
  id: broadcaster_id,
  twitch_access_token,
}: {
  id: string;
  twitch_access_token: string;
}): Promise<ITwitchSubscription[]> => {
  try {
    const params = { first: String(chunk_size), broadcaster_id };
    const result: ITwitchSubscription[] = [];

    let qs = new URLSearchParams(params);
    let exit = false;

    while (!exit) {
      const response: ITwitchSubscriptionsResponse = await API.get(`/users/follows?${qs}`, {
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

    return result;
  } catch (err) {
    throw err;
  }
};

export const setTitle = async ({
  title,
  twitch_access_token,
  broadcaster_id,
}: {
  title: string;
  twitch_access_token: string;
  broadcaster_id: string;
}): Promise<void> => {
  try {
    const qs = new URLSearchParams({
      broadcaster_id,
    });

    await API.patch(
      `/channels?${qs}`,
      { title },
      {
        headers: {
          Authorization: `Bearer ${twitch_access_token}`,
        },
      }
    );
  } catch (err) {
    throw err;
  }
};

export const setGame = async ({
  game: name,
  twitch_access_token,
  broadcaster_id,
}: {
  game: string;
  twitch_access_token: string;
  broadcaster_id: string;
}): Promise<void> => {
  try {
    const response: ITwitchGamesResponse = await API.get(`/games?name=${name}`, {
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

    await API.patch(
      `/channels?broadcaster_id=${broadcaster_id}`,
      {
        game_id: response.data[0].id,
      },
      {
        headers: {
          Authorization: `Bearer ${twitch_access_token}`,
        },
      }
    );
  } catch (err) {
    throw err;
  }
};

export default API;
