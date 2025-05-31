/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

export const followPageAction = createAction('VUBLOX_FOLLOW_PAGE_FOLLOW');
export const unfollowPageAction = createAction('VUBLOX_UNFOLLOW_PAGE_FOLLOW');
export const getFollowersAction = createAction('VUBLOX_FOLLOW_GET_FOLLOWERS');
export const getFollowingAction = createAction('VUBLOX_FOLLOW_GET_FOLLOWING');
