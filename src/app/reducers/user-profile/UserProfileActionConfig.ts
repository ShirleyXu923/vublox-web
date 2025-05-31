/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

// Action Declarations
// Suggested Action Name Standard: ORG_MODULE_ACTION_ANY
export const getMyProfileAction = createAction('VUBLOX_USER_PROFILE_GET_MY_PROFILE');
export const updateCoverPictureAction = createAction('VUBLOX_USER_PROFILE_UPDATE_COVER_PICTURE');
export const updateProfilePictureAction = createAction('VUBLOX_USER_PROFILE_UPDATE_PROFILE_PICTURE');
export const updateProfileAction = createAction('VUBLOX_USER_PROFILE_UPDATE_PROFILE');

export const getProfileAction = createAction('VUBLOX_USER_PROFILE_GET_PROFILE');
export const getProfileTimelineAction = createAction('VUBLOX_USER_PROFILE_GET_PROFILE_TIMELINE');
export const followProfileAction = createAction('VUBLOX_USER_PROFILE_FOLLOW_PROFILE');
export const unfollowProfileAction = createAction('VUBLOX_USER_PROFILE_UNFOLLOW_PROFILE');

export const getCreatedNftsAction = createAction('VUBLOX_USER_PROFILE_GET_CREATED_NFTS');
export const getTopEarningsPostsAction = createAction('VUBLOX_USER_PROFILE_GET_TOP_EARNINGS_POSTS');
export const getCollectedNftsAction = createAction('VUBLOX_USER_PROFILE_GET_COLLECTED_NFTS');
export const getFavoriteNftsAction = createAction('VUBLOX_USER_PROFILE_GET_FAVORITE_NFTS');
export const getFollowersAction = createAction('VUBLOX_USER_PROFILE_GET_FOLLOWERS');
export const getFollowingAction = createAction('VUBLOX_USER_PROFILE_GET_FOLLOWING');

export const getAnalyticsAction = createAction('VUBLOX_USER_PROFILE_GET_ANALYTICS');
