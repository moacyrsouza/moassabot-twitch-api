import 'dotenv/config';
import axios from 'axios';
import { URLSearchParams } from 'url';
import { ITwitchToken } from './types';

const API = axios.create({
  baseURL: 'https://id.twitch.tv/oauth2',
});

API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    throw error.response.data;
  }
);

export const getAccessToken = async ({
  code,
  redirect_uri,
}: {
  code: string;
  redirect_uri: string;
}): Promise<ITwitchToken> => {
  try {
    const qs = new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri,
    });

    const response: ITwitchToken = await API.post(`/token?${qs}`);
    return response;
  } catch (err) {
    throw err;
  }
};

export const refreshAccessToken = async (refresh_token: string): Promise<ITwitchToken> => {
  try {
    const qs = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
    });

    const response: ITwitchToken = await API.post(`/token?${qs}`);
    return response;
  } catch (err) {
    throw err;
  }
};

export default API;
