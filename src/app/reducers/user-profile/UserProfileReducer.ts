import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import {
  getCreatedNftsAction,
  getMyProfileAction, getProfileAction, updateCoverPictureAction, updateProfilePictureAction,
} from './UserProfileActionConfig';

// reducers
const defaultState = {
  myProfile: {},
  profile: {
    id: '',
    first_name: '',
    last_name: '',
    bio: '',
    display_name: '',
    followers_count: 0,
    following_count: 0,
    posts_count: 0,
    views_count: 0,
    is_following: false,
    is_follower: false,
    is_private: false,
    image: {
      sm: '',
      md: '',
    },
    cover_image: {
      sm: '',
      md: '',
    },
    profile: {
      external_id: '',
    },
    claimed: false,
  },
  posts: [],
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({
  [`${getMyProfileAction}`](state, { payload }) {
    return {
      ...state,
      myProfile: payload,
    };
  },
  [`${updateCoverPictureAction}`](state, { payload }) {
    return {
      ...state,
      myProfile: {
        ...state.myProfile,
        cover_picture: payload,
      },
    };
  },
  [`${updateProfilePictureAction}`](state, { payload }) {
    return {
      ...state,
      myProfile: {
        ...state.myProfile,
        profile_picture: payload,
      },
    };
  },
  [`${getCreatedNftsAction}`](state, { payload }) {
    return {
      ...state,
      posts: payload.items,
    };
  },
  [`${getProfileAction}`](state, { payload }: AnyAction) {
    return {
      ...state,
      profile: {
        ...payload,
        bio: payload?.profile?.bio,
      },
    };
  },
}, defaultState);

export default reducer;
