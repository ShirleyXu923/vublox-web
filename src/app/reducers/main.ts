import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import persistConfig from '@config/redux-persist';
import AnalyticsReducer from '@reducers/analytics/AnalyticsReducer';
import AppReducer from '@reducers/app/AppReducer';
import AuthReducer from '@reducers/auth/AuthReducer';
import CategoryReducer from '@reducers/category/CategoryReducer';
import EventReducer from '@reducers/event/EventReducer';
import FollowReducer from '@reducers/follow/FollowReducer';
import LeadReducer from '@reducers/lead/LeadReducer';
import LocationReducer from '@reducers/location/LocationReducer';
import OrganizationReducer from '@reducers/organization/OrganizationReducer';
import PostReducer from '@reducers/post/PostReducer';
import SearchReducer from '@reducers/search/SearchReducer';
import TimelineReducer from '@reducers/timeline/TimelineReducer';
import ProfileReducer from '@reducers/user-profile/UserProfileReducer';

const reducers = combineReducers({
  Auth: persistReducer(persistConfig.auth, AuthReducer),
  Event: EventReducer,
  Follow: FollowReducer,
  Category: CategoryReducer,
  Organization: OrganizationReducer,
  Timeline: TimelineReducer,
  App: persistReducer(persistConfig.app, AppReducer),
  Location: LocationReducer,
  Post: PostReducer,
  Search: SearchReducer,
  Profile: ProfileReducer,
  Lead: LeadReducer,
  Analytics: AnalyticsReducer,
  // Name: NameReducer
});

export default reducers;
