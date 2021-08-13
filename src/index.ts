export { getAccessToken, refreshAccessToken } from './auth';
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
} from './helix';

import Auth from './auth';
import Helix from './helix';

export default { Auth, Helix };
