declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';

      TWITCH_CLIENT_ID: string;
      TWITCH_CLIENT_SECRET: string;
    }
  }
}

export {};
