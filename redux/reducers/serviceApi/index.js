/**
 * @providesModule WeFit.Redux.Reducers.ServiceApi
 */

// import { Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { MY_SESSIONS_TABS, REVIEWS_DETAIL_TABS, WEEKDAY_TABS_COUNT } from 'redux/constants';
import { PREFIXES, SERVICE_API } from 'redux/types';

// Locals
import paginatedTabDataReducer from './paginatedTabDataReducer';
import plainDataReducer from './plainDataReducer';
import requestStatusReducer from './requestStatusReducer';
import singleTabDataReducer from './singleTabDataReducer';

const { PAST, UPCOMING } = MY_SESSIONS_TABS;
const { SESSION, STUDIO } = REVIEWS_DETAIL_TABS;

const DEFAULT_REQUEST_STATUS = { error: undefined, loading: false, progress: 0 };
const DEFAULT_ARRAY_DATA = { data: [], hasMore: false, ...DEFAULT_REQUEST_STATUS };
const DEFAULT_OBJECT_DATA = { data: undefined, ...DEFAULT_REQUEST_STATUS };

function defaultTabsData(contentData) {
  return _.zipObject(_.range(WEEKDAY_TABS_COUNT), Array(WEEKDAY_TABS_COUNT).fill(contentData));
}

const DEFAULT_STATES = {
  articleCategories: DEFAULT_ARRAY_DATA,
  articleDetail: DEFAULT_OBJECT_DATA,
  articleFeeds: DEFAULT_ARRAY_DATA,
  articleFilter: DEFAULT_ARRAY_DATA,
  avatarUpload: DEFAULT_REQUEST_STATUS,
  changePasswordRequest: DEFAULT_REQUEST_STATUS,
  detailReviews: { [SESSION]: DEFAULT_ARRAY_DATA, [STUDIO]: DEFAULT_ARRAY_DATA },
  favoriteStudios: DEFAULT_ARRAY_DATA,
  favoriteArticle: DEFAULT_ARRAY_DATA,
  forgotPasswordRequest: DEFAULT_REQUEST_STATUS,
  announcements: DEFAULT_ARRAY_DATA,
  fullSizeArticle: DEFAULT_ARRAY_DATA,
  halfSizeArticle: DEFAULT_ARRAY_DATA,
  membershipActivation: DEFAULT_REQUEST_STATUS,
  membershipPacks: DEFAULT_ARRAY_DATA,
  mySessions: { [PAST]: DEFAULT_ARRAY_DATA, [UPCOMING]: DEFAULT_ARRAY_DATA },
  overallSchedules: defaultTabsData(DEFAULT_ARRAY_DATA),
  paymentOrderCancel: DEFAULT_REQUEST_STATUS,
  paymentOrderRequest: DEFAULT_OBJECT_DATA,
  pendingReviews: DEFAULT_ARRAY_DATA,
  personalInfo: DEFAULT_REQUEST_STATUS,
  promoCodeChecking: DEFAULT_OBJECT_DATA,
  referralCodeLinking: DEFAULT_OBJECT_DATA,
  resetPasswordRequest: DEFAULT_REQUEST_STATUS,
  reviewCancel: DEFAULT_REQUEST_STATUS,
  reviewSubmission: DEFAULT_REQUEST_STATUS,
  sessionCancel: DEFAULT_OBJECT_DATA,
  sessionReserve: DEFAULT_OBJECT_DATA,
  studioDetail: DEFAULT_OBJECT_DATA,
  studioFavorUpdate: DEFAULT_REQUEST_STATUS,
  studioSchedules: defaultTabsData(DEFAULT_ARRAY_DATA),
  studiosMap: defaultTabsData(DEFAULT_OBJECT_DATA),
  trialStart: DEFAULT_REQUEST_STATUS,
  userDataUpdate: DEFAULT_REQUEST_STATUS,
  userFeeds: DEFAULT_ARRAY_DATA,
  userReferrals: DEFAULT_OBJECT_DATA,
  userSettingsUpdate: DEFAULT_REQUEST_STATUS,
};

export default function serviceApiReducer(state = DEFAULT_STATES, action) {
  const { type } = action;

  if (_.startsWith(type, SERVICE_API.GET_DETAIL_REVIEWS) ||
      _.startsWith(type, SERVICE_API.GET_MY_SESSIONS) ||
      _.startsWith(type, SERVICE_API.GET_OVERALL_SCHEDULES) ||
      _.startsWith(type, SERVICE_API.GET_STUDIO_SCHEDULES))
    return paginatedTabDataReducer(state, action);

  if (_.startsWith(type, SERVICE_API.CANCEL_PAYMENT_ORDER) ||
      _.startsWith(type, SERVICE_API.CANCEL_REVIEW) ||
      _.startsWith(type, SERVICE_API.CHANGE_PASSWORD) ||
      _.startsWith(type, SERVICE_API.GET_USER_DATA) ||
      _.startsWith(type, SERVICE_API.FAVOR_STUDIO) ||
      _.startsWith(type, SERVICE_API.FORGOT_PASSWORD) ||
      _.startsWith(type, SERVICE_API.REDEEM_MEMBERSHIP) ||
      _.startsWith(type, SERVICE_API.RESET_PASSWORD) ||
      _.startsWith(type, SERVICE_API.SUBMIT_REVIEW) ||
      _.startsWith(type, SERVICE_API.UPDATE_PERSONAL_INFO) ||
      _.startsWith(type, SERVICE_API.UPDATE_USER_SETTINGS) ||
      _.startsWith(type, SERVICE_API.UPLOAD_AVATAR))
    return requestStatusReducer(state, action);
  
  if (_.startsWith(type, SERVICE_API.GET_STUDIOS_MAP))
    return singleTabDataReducer(state, action);

  if (type === SERVICE_API.RESET_AVATAR_UPLOAD)
    return { ...state, avatarUpload: DEFAULT_REQUEST_STATUS };

  if (_.startsWith(type, PREFIXES.SERVICE_API))
    return plainDataReducer(state, action);

  return state;
}
