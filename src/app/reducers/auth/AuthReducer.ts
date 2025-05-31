import { uniqWith } from 'lodash';
import { AnyAction } from 'redux';
import { handleActions, combineActions } from 'redux-actions';

import { saveClientInterestsAction } from '@reducers/app/AppActionConfig';
import { acceptInviteAction, declineInviteAction } from '@reducers/event/EventActionConfig';

import {
  loginAction,
  logoutAction,
  clearUserTokenAction,
  verifyEmailAction,
  sendVerificationCodeAction,
  verifyCodeAction,
  changePasswordAction,
  getUserDetailsAction,
  changeAccountAction,
  externalLoginAction,
  updateSettingsAction,
  deleteAccountAction,
  changeNewPasswordAction,
  updateClientSettingsAction,
  getNotificationsAction,
} from './AuthActionConfig';
import { updateOrganizationAction } from '../organization/OrganizationActionConfig';
import { updateProfileAction } from '../user-profile/UserProfileActionConfig';

// reducers
const defaultState = {
  accessToken: null,
  user: {
    id: '',
    email: '',
    interests: [],
    verified_at: null,
    profile: {
      first_name: '',
      last_name: '',
      display_name: '',
      bio: '',
      username: '',
      birth_date: null as Date | null,
      placeOfBirth: {
        address: '',
        country_code: '',
        latitude: null as number | null,
        longitude: null as number | null,
        name: '',
      },
      cover_image: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
      },
      image: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
      },
      verified_at: null,
    },
    settings: {},
  },
  errors: {},
  codeValidityInSeconds: 120,
  forgotPassword: {
    email_or_mobile: '',
    timestamp: '',
    account_reset_id: '',
    verification_code: '',
  },
  referrer: {},
  // either profile or organization
  account: {
    id: '',
    display_name: '',
    name: '',
    type: 'user',
  },
  notifications: [],
  totalNotifications: 0,
  unreadNotifications: 0,
};

type State = typeof defaultState;

const reducer = handleActions<State, AnyAction>({
  [`${combineActions(loginAction, externalLoginAction, verifyEmailAction)}`](state, { payload, params }: AnyAction) {
    return {
      ...state,
      accessToken: payload.accessToken,
      user: payload.user,
      account: {
        ...payload.user,
        type: 'user',
      },
      referrer: params.referrer_id ? {} : state.referrer,
    };
  },
  [`${logoutAction}`](state: State) {
    return {
      ...defaultState,
      referrer: state.referrer,
    };
  },
  [`${combineActions(getUserDetailsAction, updateSettingsAction, changeNewPasswordAction)}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      user: payload,
      account: state.account?.id === payload.id ? {
        ...payload,
        type: 'user',
      } : state.account,
    };
  },
  [`${combineActions(clearUserTokenAction, deleteAccountAction)}`]() {
    return defaultState;
  },
  [`${sendVerificationCodeAction}`](state, { payload, params }: AnyAction) {
    return {
      ...state,
      codeValidityInSeconds: payload.codeValidityInSeconds,
      forgotPassword: {
        email_or_mobile: params.email_or_mobile,
        timestamp: new Date(),
      } as any,
    };
  },
  [`${verifyCodeAction}`](state, { payload, params }: AnyAction) {
    return {
      ...state,
      codeValidityInSeconds: 0,
      forgotPassword: {
        ...state.forgotPassword,
        ...payload,
        verification_code: params.verification_code,
        timestamp: null,
      },
    };
  },
  [`${changePasswordAction}`](state: State) {
    return {
      ...state,
      forgotPassword: {
        email_or_mobile: '',
      },
    };
  },
  [`${changeAccountAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      account: payload,
    };
  },
  [`${updateOrganizationAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      account: {
        ...payload,
        type: 'organization',
      },
    };
  },
  [`${updateProfileAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload,
      },
      account: {
        ...payload,
        type: 'user',
      },
    };
  },
  [`${saveClientInterestsAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      user: {
        ...state.user,
        interests: payload,
      },
    };
  },
  [`${changeNewPasswordAction}`](state: State, { params }: AnyAction) {
    return {
      ...state,
      user: params.external_id ? {
        ...state.user,
        clientBinding: undefined,
      } : { ...state.user },
    };
  },
  [`${updateClientSettingsAction}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      user: {
        ...state.user,
        settings: {
          ...state.user.settings,
          ...payload,
        },
      },
    };
  },
  [`${combineActions(acceptInviteAction, declineInviteAction)}`](state: State, { payload }: AnyAction) {
    return {
      ...state,
      notifications: state.notifications.map((notification: any) => {
        if (notification.data_id === payload.event_id && notification.action === 'Invite') {
          return {
            ...notification,
            invite: {
              ...notification.invite,
              status: payload.status,
            },
          };
        }
        return notification;
      }),
    };
  },
  [`${getNotificationsAction}`](state: State, { payload }: AnyAction) {
    const removedDuplicates: any = uniqWith(
      payload,
      (a: any, b: any) => (
        a.data_id === b.data_id && a.sender_id === b.sender_id && a.action === b.action
      ),
    );

    const mappedNotifications = removedDuplicates
      .map((item: any) => ({ ...item, senders: [] }))
      .reduce(
        (a: any, b: any) => {
          const res = a.find((c: any) => c.action === b.action && c.action.toLowerCase() === 'upvote' && !!c.read_at === !!b.read_at);

          if (res) {
            res.senders.push(b.sender);
            return a;
          }

          a.push(b);

          return a;
        }, []);

    let unread = 0;
    const total = payload.length;

    mappedNotifications.forEach((item: any) => {
      if (!item.read_at) {
        unread++;
      }
    });

    return {
      ...state,
      notifications: mappedNotifications,
      unreadNotifications: unread,
      totalNotifications: total,
    };
  },
}, defaultState);

export default reducer;
