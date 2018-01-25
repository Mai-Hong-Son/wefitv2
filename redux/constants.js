/**
 * @providesModule WeFit.Redux.Constants
 */

import _ from 'lodash';

export const API_CONFIGS = {
  API_VERSION: 'v1',
  BASE_URI: 'https://api.wefit.vn',
  PAGINATION: 20,
  REQUEST_METHODS: {
    DELETE: 'del',
    GET: 'get',
    POST: 'post',
    PUT: 'put',
  },
  RESPONSE_STATUSES: {
    BAD_GATEWAY: 502,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    NOT_FOUND: 404,
    SERVICE_UNAVAILABLE: 503,
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    UNPROCESSABLE_ENTITY: 422,
  },
};

// App-wide constants (to be used in both Redux & Components)
export const AXIOS_REQUEST_SUFFIXES = { ERROR: ':ERROR', SUCCESS: ':SUCCESS' };

export const AVAILABLE_LANGUAGES = _.filter(
  require('app/data/configs/languages.json'), { enabled: true }
);

export const DEFAULT_LANGUAGE = 'vi';

export const FACEBOOK_PERMISSIONS = ['email', 'public_profile', 'user_friends'];

export const FCM_NOTIFICATION_KEYS = {
  APNS: 'aps',
  FCM_ANDROID: 'fcm',
  OPENED_FROM_TRAY: 'opened_from_tray',
  PAYLOAD: 'wefit.notif.data.payload',
  TYPE: 'wefit.notif.data.type',
};

export const FCM_NOTIFICATION_TYPES = {
  CHECKED_IN: 'checked_in',
  LONG_TIME_INACTIVE: 'long_time_inactive',
  STUDIO_UPDATE: 'studio_update',
  NOTIF_ARTICLE: 'notif_article',
};

export const FEED_TYPES = {
  ANNOUNCEMENTS: 'announcements',
  FULL_SIZE_ARTICLES: 'full-size-articles',
  FAVOR_ARTICLE: 'bookmarks',
  HALF_SIZE_ARTICLES: 'half-size-articles',
  NEWCOMER: 'newcomer',
  PENDING_ORDER: 'pending-order',
  SESSION_OCCURRING: 'session-occurring',
  SESSION_REVIEW: 'session-review',
  SESSION_UPCOMING: 'session-upcoming',
  WEFIT_TIPS: 'wefit-tips',
};

export const FIREBASE_DB_COLLECTIONS = {
  FCM_TOKENS: 'fcm_tokens',
  REMOTE_CONFIGS: 'remote_configs_v2',
};

export const GLOBAL_ALERT_TYPES = {
  CUSTOM: 'custom', ERROR: 'error', INFO: 'info', SUCCESS: 'success', WARN: 'warn',
};

export const MY_SESSIONS_TABS = {
  UPCOMING: 'upcoming',
  PAST: 'past',
};

export const PAYMENT_TYPES = {
  ATM: 'atm',
  CREDIT: 'credit',
};

export const REVIEWS_DETAIL_TABS = {
  SESSION: 'sessionTab',
  STUDIO: 'studioTab',
};

export const WEEKDAY_TABS_COUNT = 7;
