// Файл followerApi.js
import { get, post, remove } from './baseApi.js';
import { ENDPOINTS } from '../constants.js';

// CRUD операции для подписчиков

// Получение списка подписчиков пользователя
export const getFollowers = async (userId, params = {}) => {
    return get(ENDPOINTS.USER_FOLLOWERS(userId), params);
};

// Получение списка пользователей, на которых подписан текущий пользователь
export const getFollowing = async (userId, params = {}) => {
    return get(ENDPOINTS.USER_FOLLOWING(userId), params);
};

// Подписаться на пользователя
export const followUser = async (follower_id, following_id) => {
    return post(ENDPOINTS.USER_FOLLOW, { follower_id, following_id });
};

// Отписаться от пользователя
export const unfollowUser = async (follower_id, following_id) => {
    return post(ENDPOINTS.USER_UNFOLLOW, { follower_id, following_id });
};