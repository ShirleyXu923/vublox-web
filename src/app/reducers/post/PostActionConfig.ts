/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

// Action Declarations
// Suggested Action Name Standard: ORG_MODULE_ACTION_ANY
export const createPostAction = createAction('VUBLOX_POST_CREATE_POST');
export const createCommentAction = createAction('VUBLOX_POST_CREATE_COMMENT');
export const addVoteAction = createAction('VUBLOX_POST_ADD_VOTE');
export const getPostAction = createAction('VUBLOX_POST_GET_POST');
export const getDiscoverPostsAction = createAction('VUBLOX_POST_GET_DISCOVER_POSTS');
export const getMyPostsAction = createAction('VUBLOX_POST_GET_MY_POSTS');
export const deletePostsAction = createAction('VUBLOX_POST_DELETE_POSTS');
export const updateUploadAction = createAction('VUBLOX_POST_UPDATE_UPLOAD');
