import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import { getMyPostsAction, getPostAction, updateUploadAction } from './PostActionConfig';

// reducers
const defaultState: any = {
  posts: {
    items: [],
    meta: {
      itemCount: 0,
    },
  },
  post: {
    id: '',
    title: '',
    media_url: null,
    media_type: '',
    description: '',
    vote_count: 0,
    comments_count: 0,
    categorize: {
      id: '',
      name: '',
      type: '',
    },
    owner: {
      id: null,
      name: null,
      display_name: null,
      is_following: false,
    },
    location: {
      id: '',
      latitude: 0,
      longitude: 0,
      address: '',
      name: '',
      slug: '',
    },
    posted_at: null,
    preview_image_urls: {
      sm: '',
      md: '',
      lg: '',
    },
    mentions: [],
    tags: [],
    comments: [],
    is_following: false,
  },
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({
  [`${updateUploadAction}`](state: State, { payload }: AnyAction) {
    // eslint-disable-next-line no-console
    console.log('FROM REDUCER... ', payload);
    return {
      ...state,
    };
  },
  [`${getMyPostsAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      posts: payload,
    };
  },
  [`${getPostAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      post: payload,
    };
  },
}, defaultState);

export default reducer;
