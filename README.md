# MOASSABOT - TWITCH API

## Getting started

Install the package with:

    yarn add @moassabot/twitchapi

    OR

    npm install @moassabot/twitchapi --save

Import the TwitchAPI class:

    const TwitchAPI = require('@moassabot/twitchapi');

    OR

    import TwitchAPI from '@moassabot/twitchapi';

Create a new instance:

    const client_id = process.env.TWITCH_CLIENT_ID;
    const client_secret = process.env.TWITCH_CLIENT_SECRET;
    const api = new TwitchAPI(client_id, client_secret);

## Properties Reference

The only properties are the Axios Instances for the two APIs: auth and helix. They might be used in order to access the base URLs or to make requests not provided in the TwitchAPI class methods.

- <a href="#auth">\_auth</a>
- <a href="#helix">\_helix</a>

### Auth

Axios instance for the OAuth Twitch API used in the <a href="#get-access-token">getAccessToken</a>, <a href="#refresh-access-token">refreshAccessToken</a>, <a href="#get-app-access-token">getAppAccessToken</a> methods. It is set in the TwitchAPI constructor with the baseURL _https://id.twitch.tv/oauth2_.

    const auth = api._auth;

### Helix

Axios instance for the Helix Twitch API used in the remaining methods. It is set in the TwitchAPI constructor with the baseURL _https://api.twitch.tv/helix_.

    const helix = api._helix;

## Methods Reference

- <a href="#get-access-token">getAccessToken</a>
- <a href="#refresh-access-token">refreshAccessToken</a>
- <a href="#get-app-access-token">getAppAccessToken</a>
- <a href="#get-user">getUser</a>
- <a href="#get-users">getUsers</a>
- <a href="#get-stream">getStream</a>
- <a href="#get-streams">getStreams</a>
- <a href="#get-editors">getEditors</a>
- <a href="#get-follows">getFollows</a>
- <a href="#get-subscriptions">getSubscriptions</a>
- <a href="#set-title">setTitle</a>
- <a href="#set-game">setGame</a>

### Get Access Token

Used in <a href="https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-authorization-code-flow">OAuth authorization code</a> flow callback to obtain a User Access Token

    const response = await api.getAccessToken({ code, redirect_uri })

#### Parameters

- context {object}
  - code {string}: Received code from twitch OAuth code flow
  - redirect_uri {string}: Redirect URI set up in your application for the OAuth code flow

#### Return

- Promise<{object}>
  - access_token {string}: Twitch Access Token
  - refresh_token {string}: Twitch Refresh Token
  - expires_in {number}: Number of seconds until token expires
  - scope {string[]}: Array with the allowed scopes
  - token_type {string}: The type of token (it should be "bearer")

### Refresh Access Token

Used to obtain a new Access Token with a Refresh Token

    const response = await api.refreshAccessToken(refresh_token)

#### Parameters

- refresh_token {string}: A valid Twitch refresh_token

#### Return

- Promise<{object}>
  - access_token {string}: Twitch Access Token
  - refresh_token {string}: Twitch Refresh Token
  - expires_in {number}: Number of seconds until token expires
  - scope {string[]}: Array with the allowed scopes
  - token_type {string}: The type of token (it should be "bearer")

### Get App Access Token

Used in <a href="https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#oauth-client-credentials-flow">OAuth client credentials flow</a> to obtain an App Access Token

    const response = await api.getAppAccessToken("chat:edit chat:read")

#### Parameters

- scopes {string}: Space-separated list of <a href="https://dev.twitch.tv/docs/authentication/#scopes">scopes</a>

#### Return

- Promise<{object}>
  - access_token {string}: Twitch Access Token
  - refresh_token {string}: Twitch Refresh Token
  - expires_in {number}: Number of seconds until token expires
  - scope {string[]}: Array with the allowed scopes
  - token_type {string}: The type of token (it should be "bearer")

### Get User

Fetch user information with a valid User Access Token.</br>
Check out the <a href="https://dev.twitch.tv/docs/api/reference#get-users">original reference</a> for more information.

    const user = await api.getUser({ twitch_access_token })

#### Parameters

- context {object}
  - twitch_access_token {string}: Twitch valid User Access Token

#### Return

- Promise<{object}>
  - id {string}: Twitch User’s ID
  - login {string}: Twitch User’s login name
  - display_name {string}: User’s display name
  - type {string}: User’s type "staff", "admin", "global_mod", or ""
  - broadcaster_type {string}: User’s broadcaster type: "partner", "affiliate", or ""
  - description {string}: User’s channel description
  - profile_image_url {string}: URL of the user’s offline image
  - offline_image_url {string}: URL of the user’s profile image
  - view_count {number}: Total number of views of the user’s channel
  - email {string}: User’s verified email address. Returned if the request includes the user:read:email scope.
  - created_at {string}: Date when the user was created

### Get Users

Fetch users information with a list of user IDs.</br>
Check out the <a href="https://dev.twitch.tv/docs/api/reference#get-users">original reference</a> for more information.

    const users = await api.getUsers({ ids, twitch_access_token })

#### Parameters

- context {object}
  - ids {string[]}: Array of Twitch User IDs
  - twitch_access_token {string}: Twitch valid App Access Token

#### Return

- Promise<{object[]}>
  - id {string}: Twitch User’s ID
  - login {string}: Twitch User’s login name
  - display_name {string}: User’s display name
  - type {string}: User’s type "staff", "admin", "global_mod", or ""
  - broadcaster_type {string}: User’s broadcaster type: "partner", "affiliate", or ""
  - description {string}: User’s channel description
  - profile_image_url {string}: URL of the user’s offline image
  - offline_image_url {string}: URL of the user’s profile image
  - view_count {number}: Total number of views of the user’s channel
  - email {string}: User’s verified email address. Returned if the request includes the user:read:email scope.
  - created_at {string}: Date when the user was created

### Get Stream

Fetch information of one stream.</br>
Check out the <a href="https://dev.twitch.tv/docs/api/reference#get-streams">original reference</a> for more information.

    const stream = await api.getStream({ id, twitch_access_token })

#### Parameters

- context {object}
  - id {string}: Twitch User ID
  - twitch_access_token {string}: Twitch valid App Access Token

#### Return

- Promise<{object}> in case the stream is online
  - id {string}: Stream ID
  - user_id {string}: ID of the user who is streaming
  - user_login {string}: Login of the user who is streaming
  - user_name {string}: Display name
  - game_id {string}: ID of the game being played on the stream
  - game_name {string}: Name of the game being played on the stream
  - type {string}: Stream type: "live" or "" (in case of error)
  - title {string}: Stream title
  - viewer_count {number}: Number of viewers watching the stream at the time of the query
  - started_at {string}: UTC timestamp
  - language {string}: Stream language. A language value is either the ISO 639-1 two-letter code for a supported stream language or “other”.
  - thumbnail_url {string}: Thumbnail URL of the stream
  - tag_ids {string[]}: Shows tag IDs that apply to the stream
  - is_mature {boolean}: Indicates if the broadcaster has specified their channel contains mature content that may be inappropriate for younger audiences
- null in case the stream is offline

### Get Streams

Fetch information of more than one stream.</br>
Check out the <a href="https://dev.twitch.tv/docs/api/reference#get-streams">original reference</a> for more information.

    const streams = await api.getStreams({ ids, twitch_access_token })

#### Parameters

- context {object}
  - id {string[]}: Twitch User IDs
  - twitch_access_token {string}: Twitch valid App Access Token

#### Return

- Promise<{object[]}>
  - id {string}: Stream ID
  - user_id {string}: ID of the user who is streaming
  - user_login {string}: Login of the user who is streaming
  - user_name {string}: Display name
  - game_id {string}: ID of the game being played on the stream
  - game_name {string}: Name of the game being played on the stream
  - type {string}: Stream type: "live" or "" (in case of error)
  - title {string}: Stream title
  - viewer_count {number}: Number of viewers watching the stream at the time of the query
  - started_at {string}: UTC timestamp
  - language {string}: Stream language. A language value is either the ISO 639-1 two-letter code for a supported stream language or “other”.
  - thumbnail_url {string}: Thumbnail URL of the stream
  - tag_ids {string[]}: Shows tag IDs that apply to the stream
  - is_mature {boolean}: Indicates if the broadcaster has specified their channel contains mature content that may be inappropriate for younger audiences

### Get Editors

Fetch a channel's list of editors.</br>
Check out the <a href="https://dev.twitch.tv/docs/api/reference#get-channel-editors">original reference</a> for more information.

    const editors = await api.getEditors({ id, twitch_access_token })

#### Parameters

- context {object}
  - id {string}: Broadcaster’s user ID associated with the channel
  - twitch_access_token {string}: Twitch valid User Access Token

#### Return

- Promise<{object[]}>
  - user_id {string}: User ID of the editor
  - user_name {string}: Display name of the editor
  - created_at {string}: Date and time the editor was given editor permissions

### Get Follows

Fetch follows from User with ID user_id / to Channel with channel_id.</br>
Check out the <a href="https://dev.twitch.tv/docs/api/reference#get-users-follows">original reference</a> for more information.

    const follows = await api.getFollows({ twitch_access_token, channel_id, user_id })

#### Parameters

At least one of channel_id and user_id paramaters must be passed. If both are defined, the return value will determine if the User with ID user_id follows the Channel with ID channel_id.

- context {object}
  - twitch_access_token {string}: Twitch valid User Access Token
  - channel_id {string}: ID of the followed channel
  - user_id {string}: ID of the following user

#### Return

- Promise<{object[]}>
  - user_id {string}: ID of the user following the channel_id user
  - from_login {string}: Login of the user following the channel_id user
  - from_name {string}: Display name corresponding to user_id
  - channel_id {string}: ID of the user being followed by the user_id user
  - to_login {string}: Login of the user being followed by the user_id user
  - to_name {string}: Display name corresponding to channel_id
  - followed_at {string}: Date and time when the user_id user followed the channel_id user

### Get Subscriptions

Fetch a Channel's Subscriptions.</br>
Check out the <a href="https://dev.twitch.tv/docs/api/reference#get-broadcaster-subscriptions">original reference</a> for more information.

    const subs = await api.getSubscriptions({ id, twitch_access_token })

#### Parameters

- context {object}
  - id {string}: User ID of the broadcaster. Must match the User ID in the Bearer token.
  - twitch_access_token {string}: Twitch valid User Access Token

#### Return

- Promise<{object[]}>
  - broadcaster_id {string}: User ID of the broadcaster
  - broadcaster_login {string}: Login of the broadcaster
  - broadcaster_name {string}: Display name of the broadcaster
  - gifter_id {string}: If the subscription was gifted, this is the user ID of the gifter. Empty string otherwise.
  - gifter_login {string}: If the subscription was gifted, this is the login of the gifter. Empty string otherwise.
  - gifter_name {string}: If the subscription was gifted, this is the display name of the gifter. Empty string otherwise.
  - is_gift {boolean}: true if the subscription is a gift subscription
  - tier {string}: Type of subscription (Tier 1, Tier 2, Tier 3).
    1000 = Tier 1, 2000 = Tier 2, 3000 = Tier 3 subscriptions.
  - plan_name {string}: Name of the subscription
  - user_id {string}: ID of the subscribed user
  - user_name {string}: Display name of the subscribed user
  - user_login {string}: Login of the subscribed user

### Set Title

Modifies a Broadcast's Title.</br>
Check out the <a href="https://dev.twitch.tv/docs/api/reference#modify-channel-information">original reference</a> for more information.

    await api.setTitle({ title, broadcaster_id, twitch_access_token })

#### Parameters

- context {object}
  - title {string}: The title of the stream. Value must not be an empty string.
  - broadcaster_id {string}: ID of the channel to be updated
  - twitch_access_token {string}: Twitch valid User Access Token

#### Return

- void

### Set Game

Modifies a Broadcast's Game.</br>
Check out the <a href="https://dev.twitch.tv/docs/api/reference#modify-channel-information">original reference</a> for more information.

    await api.setGame({ game, broadcaster_id, twitch_access_token })

#### Parameters

- context {object}
  - game {string}: The name of the current game being played on the channel. Use “” (an empty string) to unset the game.
  - broadcaster_id {string}: ID of the channel to be updated
  - twitch_access_token {string}: Twitch valid User Access Token

#### Return

- void
