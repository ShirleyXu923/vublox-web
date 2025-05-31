import {
  generateGetAction, generatePostAction, generatePutAction,
  generateDeleteAction, generatePatchAction,
} from '@services/ActionDispatcher';

import {
  followProfileAction,
  getCollectedNftsAction,
  getCreatedNftsAction,
  getTopEarningsPostsAction,
  getFavoriteNftsAction,
  getFollowersAction,
  getFollowingAction,
  getMyProfileAction,
  getProfileAction,
  unfollowProfileAction,
  updateCoverPictureAction,
  updateProfileAction,
  updateProfilePictureAction,
  getAnalyticsAction,
} from './UserProfileActionConfig';

// action request dispatchers
const getMyProfileRequest = () => generateGetAction(
  // action name
  getMyProfileAction,
  // url
  'users/profile',
);

const updateCoverPictureRequest = (data: any) => generatePostAction(
  // action name
  updateCoverPictureAction,
  // url
  'my-profile/cover-picture',
  data,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  },
);

const updateProfilePictureRequest = (data: any) => generatePostAction(
  // action name
  updateProfilePictureAction,
  // url
  'my-profile/profile-picture',
  data,
  {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  },
);

const updateProfileRequest = (data: any) => generatePatchAction(
  // action name
  updateProfileAction,
  // url
  'my-profile',
  data,
);

const getProfileRequest = (queryParams = {}) => generateGetAction(
  // action name
  getProfileAction,
  // url
  'users/profile',
  { queryParams },
);

const getProfileTimelineRequest = (queryParams: any = {}) => generateGetAction(
  // action name
  getProfileAction,
  // url
  `profile/${queryParams.id}/timeline`,
  { queryParams },
);

const followProfileRequest = (id: number) => generatePutAction(
  // action name
  followProfileAction,
  // url
  `profile/${id}/follow`,
);

const unfollowProfileRequest = (id: number) => generateDeleteAction(
  // action name
  unfollowProfileAction,
  // url
  `profile/${id}/follow`,
);

const getCreatedNftsRequest = (data: any) => generateGetAction(
  // action name
  getCreatedNftsAction,
  // url
  `profile/${data.id}/created-nfts`,
  { queryParams: data },
);

const getTopEarningsPostsRequest = (data: any) => generateGetAction(
  // action name
  getTopEarningsPostsAction,
  // url
  `profile/${data.id}/top-earnings`,
  { queryParams: data },
);

const getCollectedNftsRequest = (data: any) => generateGetAction(
  // action name
  getCollectedNftsAction,
  // url
  `profile/${data.id}/collected-nfts`,
  { queryParams: data },
);

const getFavoriteNftsRequest = (data: any) => generateGetAction(
  // action name
  getFavoriteNftsAction,
  // url
  `profile/${data.id}/favorite-nfts`,
  { queryParams: data },
);

const getFollowersRequest = (data: any) => generateGetAction(
  // action name
  getFollowersAction,
  // url
  `profile/${data.id}/followers`,
  { queryParams: data },
);

const getFollowingRequest = (data: any) => generateGetAction(
  // action name
  getFollowingAction,
  // url
  `profile/${data.id}/following`,
  { queryParams: data },
);

const getAnalyticsRequest = (data: any) => generateGetAction(
  // action
  getAnalyticsAction,
  // url
  `profile/${data.id}/analytics`,
  { queryParams: data },
);

// register actions here
export {
  // normal dispatch

  // async (request) dispatch
  getMyProfileRequest,
  updateCoverPictureRequest,
  updateProfilePictureRequest,
  updateProfileRequest,
  getProfileRequest,
  getProfileTimelineRequest,
  followProfileRequest,
  unfollowProfileRequest,
  getCreatedNftsRequest,
  getTopEarningsPostsRequest,
  getCollectedNftsRequest,
  getFavoriteNftsRequest,
  getFollowersRequest,
  getFollowingRequest,
  getAnalyticsRequest,
};
