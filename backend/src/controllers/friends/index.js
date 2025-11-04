/**
 * Central export for all friend-related controllers
 * Import with: import * as friendsController from "../controllers/friends/index.js"
 */

export { sendFriendRequest } from "./send.js";
export { acceptFriendRequest } from "./accept.js";
export { rejectFriendRequest } from "./reject.js";
export { removeFriend } from "./remove.js";
export { getFriends } from "./list.js";
export { getFriendRequests } from "./requests.js";
export { getFriendshipStatus } from "./status.js";
export { cleanupFriendDataOnUserDelete } from "./cleanup.js";
