import { generateGetAction, generatePostAction } from '@services/ActionDispatcher';

import {
  followPageAction, getFollowersAction, getFollowingAction, unfollowPageAction,
} from './FollowActionConfig';

const followPageRequest = (data: any) => generatePostAction(
  // action name
  followPageAction,
  // url
  'follow',
  // data
  data,
);

const unfollowPageRequest = (data: any) => generatePostAction(
  // action name
  unfollowPageAction,
  // url
  'unfollow',
  data,
);

const getFollowersRequest = (queryParams: any) => generateGetAction(
  getFollowersAction,
  `followers/${queryParams.id}`,
  { queryParams },
);

const getFollowingRequest = (queryParams: any) => generateGetAction(
  getFollowingAction,
  `following/${queryParams.id}`,
  { queryParams },
);

export {
  followPageRequest,
  unfollowPageRequest,
  getFollowersRequest,
  getFollowingRequest,
};
