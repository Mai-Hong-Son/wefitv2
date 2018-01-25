/**
 * @providesModule WeFit.Redux.Types
 */

export const PREFIXES = {
  AUTH: 'auth/',
  FIREBASE: 'firebase/',
  SERVICE_API: 'serviceApi/',
  SHARED: 'shared/',
  STATIC_DATA: 'staticData/',
};

export const AUTH = {
  CONNECT_FACEBOOK:           'auth/CONNECT_FACEBOOK',
  DEAUTHORIZE:                'auth/DEAUTHORIZE',
  
  LOGIN_EMAIL:                'auth/LOGIN_EMAIL',
  LOGIN_SOCIAL:               'auth/LOGIN_SOCIAL',
  
  SIGN_UP_EMAIL:              'auth/SIGN_UP_EMAIL',
  UPDATE_MEMBERSHIP:          'auth/UPDATE_MEMBERSHIP',
};

export const FIREBASE = {
  CLEAR_TOKEN:                'firebase/CLEAR_TOKEN',
  RECEIVE_NOTIFICATION:       'firebase/RECEIVE_NOTIFICATION',
  REFRESH_TOKEN:              'firebase/REFRESH_TOKEN',
  REGISTER_DEVICE:            'firebase/REGISTER_DEVICE',
  REVOKE_DEVICE:              'firebase/REVOKE_DEVICE',
};

export const SERVICE_API = {
  ADD_FAVORITE:               'serviceApi/ADD_FAVORITE',
  ARTICLE_DETAIL:              'serviceApi/ARTICLE_DETAIL',

  CANCEL_PAYMENT_ORDER:       'serviceApi/CANCEL_PAYMENT_ORDER',
  CANCEL_REVIEW:              'serviceApi/CANCEL_REVIEW',
  CANCEL_SESSION:             'serviceApi/CANCEL_SESSION',
  CHANGE_PASSWORD:            'serviceApi/CHANGE_PASSWORD',
  CHECK_PROMOCODE_CODE:       'serviceApi/CHECK_PROMOCODE_CODE',

  DELETE_FAVORITE:            'serviceApi/DELETE_FAVORITE',

  FAVOR_ARTICLE:              'serviceApi/FAVOR_ARTICLE',
  FAVOR_STUDIO:               'serviceApi/FAVOR_STUDIO',
  FORGOT_PASSWORD:            'serviceApi/FORGOT_PASSWORD',

  GET_ARTICLE_FEEDS:          'serviceApi/GET_ARTICLE_FEEDS',
  GET_ANNOUNCEMENTS:          'serviceApi/GET_ANNOUNCEMENTS',
  GET_CATEGORIES_CONTENT:     'serviceApi/GET_CATEGORIES_CONTENT',
  GET_ARTICLES_FILTER:        'serviceApi/GET_ARTICLES_FILTER',
  GET_DETAIL_REVIEWS:         'serviceApi/GET_DETAIL_REVIEWS',
  GET_FAVORITE_STUDIOS:       'serviceApi/GET_FAVORITE_STUDIOS',
  GET_FULL_SIZE_ARTICLE:      'serviceApi/GET_FULL_SIZE_ARTICLE',
  GET_HALF_SIZE_ARTICLE:      'serviceApi/GET_HALF_SIZE_ARTICLE',
  GET_MEMBERSHIP_PACKS:       'serviceApi/GET_MEMBERSHIP_PACKS',
  GET_MY_SESSIONS:            'serviceApi/GET_MY_SESSIONS',
  GET_OVERALL_SCHEDULES:      'serviceApi/GET_OVERALL_SCHEDULES',
  GET_PENDING_REVIEWS:        'serviceApi/GET_PENDING_REVIEWS',
  GET_STUDIOS_DETAIL:         'serviceApi/GET_STUDIOS_DETAIL',
  GET_STUDIOS_MAP:            'serviceApi/GET_STUDIOS_MAP',
  GET_STUDIO_SCHEDULES:       'serviceApi/GET_STUDIO_SCHEDULES',
  GET_USER_DATA:              'serviceApi/GET_USER_DATA',
  GET_USER_FEEDS:             'serviceApi/GET_USER_FEEDS',
  GET_USER_REFERRALS:         'serviceApi/GET_USER_REFERRALS',

  LINK_REFERRAL_CODE:         'serviceApi/LINK_REFERRAL_CODE',

  REDEEM_MEMBERSHIP:          'serviceApi/REDEEM_MEMBERSHIP',
  REQUEST_PAYMENT_ORDER:      'serviceApi/REQUEST_PAYMENT_ORDER',
  RESERVE_SESSION:            'serviceApi/RESERVE_SESSION',
  RESET_AVATAR_UPLOAD:        'serviceApi/RESET_AVATAR_UPLOAD',
  RESET_PASSWORD:             'serviceApi/RESET_PASSWORD',

  START_TRIAL:                'serviceApi/START_TRIAL',
  SUBMIT_REVIEW:              'serviceApi/SUBMIT_REVIEW',
  
  UPDATE_PERSONAL_INFO:       'serviceApi/UPDATE_PERSONAL_INFO',
  UPDATE_USER_SETTINGS:       'serviceApi/UPDATE_USER_SETTINGS',
  UPLOAD_AVATAR:              'serviceApi/UPLOAD_AVATAR',
};

export const SHARED = {
  ACTIVATE_DEVELOPER_MODE:    'shared/ACTIVATE_DEVELOPER_MODE',
  APPLY_FILTERS:              'shared/APPLY_FILTERS',
  APPLY_ARTICLE_FILTERS:      'shared/APPLY_ARTICLE_FILTERS',

  CHANGE_LANGUAGE:            'shared/CHANGE_LANGUAGE',
  CLEAR_FILTERS:              'shared/CLEAR_FILTERS',
  CLEAR_GLOBAL_ALERT:         'shared/CLEAR_GLOBAL_ALERT',
  
  REQUEST_USER_LOCATION:      'shared/REQUEST_USER_LOCATION',
  RESET_USER_LOCATION:        'shared/RESET_USER_LOCATION',

  SET_GOALS:                  'shared/SET_GOALS',
  SHOW_GLOBAL_ALERT:          'shared/SHOW_GLOBAL_ALERT',

  UPDATE_STUDIO_FAVOR:        'shared/UPDATE_STUDIO_FAVOR',

  // For redux-reset middleware
  RESET_REDUX_STORE:          'RESET_REDUX_STORE',
};

export const STATIC_DATA = {
  BEGIN_FETCHING:             'staticData/BEGIN_FETCHING',
  CLEAR_CACHE:                'staticData/CLEAR_CACHE',
  END_FETCHING:               'staticData/END_FETCHING',
  GET_REMOTE_CONFIGS:         'staticData/GET_REMOTE_CONFIGS',
  GET_REMOTE_DATA:            'staticData/GET_REMOTE_DATA',
  GET_STUDIOS:                'staticData/GET_STUDIOS',
  LOAD_LOCAL_DATA:            'staticData/LOAD_LOCAL_DATA',
};
