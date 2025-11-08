import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
} from "../services/friendService.js";
import { showErrorAlert } from "../utils/errorHandlers.js";

/**
 * Create a mutation for sending a friend request
 * @param {Object} queryClient - React Query client instance
 * @param {string} userId - ID of the user to send request to
 * @returns {Object} Mutation configuration for useMutation
 */
export function createSendFriendRequestMutation(queryClient, userId) {
  return {
    mutationFn: sendFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries(["friendshipStatus", userId]);
      queryClient.invalidateQueries(["friendRequests"]);
      queryClient.invalidateQueries(["sentFriendRequests"]);
    },

    onError: (error) => {
      showErrorAlert(error, "Failed to send friend request. Please try again.");
    },
  };
}

/**
 * Create a mutation for accepting a friend request
 * @param {Object} queryClient - React Query client instance
 * @param {string} userId - Optional ID of the user accepting from (for profile page invalidation)
 * @returns {Object} Mutation configuration for useMutation
 */
export function createAcceptFriendRequestMutation(queryClient, userId = null) {
  return {
    mutationFn: acceptFriendRequest,

    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries(["friendshipStatus", userId]);
      }
      queryClient.invalidateQueries(["friendRequests"]);
      queryClient.invalidateQueries(["myFriends"]);
      queryClient.invalidateQueries(["userFriends"]);
    },

    onError: (error) => {
      showErrorAlert(
        error,
        "Failed to accept friend request. Please try again."
      );
    },
  };
}

/**
 * Create a mutation for rejecting a friend request
 * @param {Object} queryClient - React Query client instance
 * @returns {Object} Mutation configuration for useMutation
 */
export function createRejectFriendRequestMutation(queryClient) {
  return {
    mutationFn: rejectFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequests"]);
    },

    onError: (error) => {
      showErrorAlert(
        error,
        "Failed to reject friend request. Please try again."
      );
    },
  };
}

/**
 * Create a mutation for canceling a sent friend request
 * @param {Object} queryClient - React Query client instance
 * @returns {Object} Mutation configuration for useMutation
 */
export function createCancelFriendRequestMutation(queryClient) {
  return {
    mutationFn: cancelFriendRequest,

    onSuccess: () => {
      queryClient.invalidateQueries(["sentFriendRequests"]);
      queryClient.invalidateQueries(["friendshipStatus"]);
    },

    onError: (error) => {
      showErrorAlert(
        error,
        "Failed to cancel friend request. Please try again."
      );
    },
  };
}

/**
 * Create a mutation for removing a friend
 * @param {Object} queryClient - React Query client instance
 * @param {string} userId - Optional ID of the user being removed (for profile page invalidation)
 * @returns {Object} Mutation configuration for useMutation
 */
export function createRemoveFriendMutation(queryClient, userId = null) {
  return {
    mutationFn: removeFriend,

    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries(["friendshipStatus", userId]);
      }
      queryClient.invalidateQueries(["myFriends"]);
      queryClient.invalidateQueries(["userFriends"]);
    },

    onError: (error) => {
      showErrorAlert(error, "Failed to remove friend. Please try again.");
    },
  };
}
