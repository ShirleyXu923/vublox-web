import { AnyAction } from 'redux';
import { handleActions } from 'redux-actions';

import {
  changeOrganizationAction,
  getCreatedPostsAction,
  getEventsByOrganizationAction,
  getFeaturedOrganizationsAction,
  getOrganizationAction,
  getOrganizationTimelineAction,
  getOrganizationsAction,
  getTimelineByOrganizationAction,
} from './OrganizationActionConfig';

// reducers
const defaultState = {
  organizations: {
    loading: true,
    list: [],
  },
  posts: [],
  selectedOrganization: {},
  organizationEvents: [],
  timeBlocks: [],
  list: [],
  organizationTimeline: {
    id: '',
    name: '',
    bio: '',
    privacy_option: 'private',
    followers_count: 0,
    posts_count: 0,
    is_following: false,
    created_by: '',
    logo: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
    },
    cover_photo: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
    },
    location: {
      name: '',
      address: '',
      latitude: '',
      longitude: '',
    },
    tags: [],
    url: [],
    contact: {
      email: '',
      is_email_hidden: false,
      website: '',
    },
    timeblockables: {},
  },
  organization: {},
  own_organizations: [],
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({
  [`${getOrganizationsAction}`](state: State, { payload, params }: AnyAction) {
    return params?.owned
      ? {
        ...state,
        own_organizations: payload?.items,
      }
      : {
        ...state,
        organizations: {
          loading: false,
          list: payload.meta?.currentPage === 1 ? payload.items : state.organizations.list,
        },
        list: payload.meta?.currentPage === 1 ? payload.items : state.organizations.list,
      };
  },
  [`${getFeaturedOrganizationsAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      organizations: {
        loading: false,
        list: payload,
      },
    };
  },
  [`${getOrganizationTimelineAction}`](state: State, { payload, params }: AnyAction) {
    const { organization }: any = payload;

    if (state.organizationTimeline.id !== organization.id || params.page === 1) {
      return {
        ...state,
        organizationTimeline: organization,
      };
    }

    const { timeblockables } = organization;

    const currentTimeblocks: any = state.organizationTimeline.timeblockables;

    Object.keys(timeblockables).forEach((key: string) => {
      if (currentTimeblocks[key]) {
        const current: any = currentTimeblocks[key];
        const timeblock: any = timeblockables[key];
        const last = current?.[current.length - 1];
        const first = timeblock?.[timeblock.length - 1];

        if (last.id !== first.id) {
          const mergedTimeblocks = [
            ...currentTimeblocks[key],
            ...timeblockables[key].filter(
              (tb: any) => !currentTimeblocks[key].some(
                (currentTimeblock: any) => currentTimeblock.id === tb.id,
              ),
            ),
          ];

          currentTimeblocks[key] = mergedTimeblocks;
        }
      } else {
        currentTimeblocks[key] = [];
        currentTimeblocks[key] = [
          ...timeblockables[key],
        ];
      }
    });

    organization.timeblockables = currentTimeblocks;

    return {
      ...state,
      organizationTimeline: organization,
    };
  },
  [`${getCreatedPostsAction}`](state, { payload }) {
    return {
      ...state,
      posts: payload.items,
    };
  },
  [`${changeOrganizationAction}`](state: State, { payload }: AnyAction) {
    return { ...state, selectedOrganization: payload };
  },
  [`${getEventsByOrganizationAction}`](state: State, { payload }: AnyAction) {
    return { ...state, organizationEvents: payload };
  },
  [`${getTimelineByOrganizationAction}`](state: State, { payload }: AnyAction) {
    return { ...state, timeBlocks: payload };
  },
  [`${getOrganizationAction}`](state: State, { payload }: AnyAction) {
    return { ...state, organization: payload };
  },
}, defaultState);

export default reducer;
