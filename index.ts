export { getAccessToken, refreshAccessToken } from './src/auth';
export {
  getUser,
  getUsers,
  getStream,
  getStreams,
  getEditors,
  getFollows,
  getSubscriptions,
  setTitle,
  setGame,
} from './src/helix';

import Auth from './src/auth';
import Helix from './src/helix';

export default { Auth, Helix };
