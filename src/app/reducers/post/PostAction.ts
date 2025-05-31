import { AppDispatch } from '@app/store';
import {
  generateAction,
  generateGetAction,
  generatePostAction,
} from '@services/ActionDispatcher';

import {
  addVoteAction,
  createCommentAction,
  createPostAction,
  deletePostsAction,
  getDiscoverPostsAction,
  getMyPostsAction,
  getPostAction,
  updateUploadAction,
} from './PostActionConfig';

// action request dispatchers
const updateUploadRequest = (value: any) => generateAction(
  // action name
  updateUploadAction,
  // data
  {
    value,
  },
);

const createPostRequest = (data: any) => generatePostAction(
  // action name
  createPostAction,
  // url
  'posts',
  // params
  data,
  // options
  {
    onUploadProgress: (event: any) => (dispatch: AppDispatch) => {
      if (event.lengthComputable) {
        const progressValue = Math.round((event.loaded * 100) / event.total);
        dispatch({
          type: updateUploadAction,
          payload: progressValue,
        });
      }
    },
  },
);

const createCommentRequest = (data: any) => generatePostAction(
  // action name
  createCommentAction,
  // url
  'posts/comment',
  data,
);

const addVoteRequest = (data: any) => generatePostAction(
  // action name
  addVoteAction,
  // url
  'posts/vote',
  data,
);

const getPostRequest = (code: string) => generateGetAction(
  // action name
  getPostAction,
  // url
  `posts/${code}`,
);

const getDiscoverPostsRequest = (queryParams: any) => generateGetAction(
  // action name
  getDiscoverPostsAction,
  // url
  'posts/discover',
  { queryParams },
);

const getMyPostsRequest = (queryParams: any) => generateGetAction(
  // action name
  getMyPostsAction,
  // url
  'posts/my-posts',
  { queryParams },
);

const deletePostsRequest = (data: any) => generatePostAction(
  // action name
  deletePostsAction,
  // url
  'posts/delete',
  // data
  data,
);

// register actions here
export {
  // normal dispatch
  updateUploadRequest,

  // async (request) dispatch
  createPostRequest,
  createCommentRequest,
  addVoteRequest,
  getPostRequest,
  getDiscoverPostsRequest,
  getMyPostsRequest,
  deletePostsRequest,
};
