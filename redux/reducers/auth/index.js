/**
 * @providesModule WeFit.Redux.Reducers.Auth
 */
import { LoginManager } from 'react-native-fbsdk';
import _ from 'lodash';

// Constants
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';
import { AUTH, PREFIXES, SERVICE_API } from 'redux/types';

// Utils
import { buildUserStates } from 'redux/utils';

// Locals
import loginReducer from './loginReducer';
import oauthReducer from './oauthReducer';

const { SUCCESS } = AXIOS_REQUEST_SUFFIXES;

const DEFAULT_STATES = {
  authToken: null,
  changePasswordRequest: { error: null, loading: false },
  emailAuth: { error: null, loading: false },
  facebookOauth: { accessToken: null, error: null, fromScene: null, loading: false },
  forgetPasswordRequest: { error: null, loading: false },
  membership: null,
  referral: null,
  socialAuth: { error: null, loading: false },
  settings: null,
  userData: null,
};

function checkAndUpdateAuthToken(state, action) {
  const { userData } = state;
  // No user authenticated yet, no need to update auth_token
  if (userData == null) return state;

  const { id: userId } = userData;
  const userInfo = _.get(action, 'payload.request.response.result_info.user_info');
  const { auth_token: authToken, id } = userInfo || {};
  
  if (!_.isEmpty(authToken) && userId === id)
    return { ...state, authToken };

  return state;
}

export default function authReducer(state = DEFAULT_STATES, action) {
  const { type } = action;

  if (type === AUTH.DEAUTHORIZE) {
    LoginManager.logOut();
    return DEFAULT_STATES;    
  }

  if (type === AUTH.UPDATE_MEMBERSHIP) {
    const { payload: membership } = action;
    return { ...state, membership };
  }

  if (_.startsWith(type, AUTH.LOGIN_EMAIL) ||
      _.startsWith(type, AUTH.LOGIN_SOCIAL) ||
      _.startsWith(type, AUTH.SIGN_UP_EMAIL))
    return loginReducer(state, action);
  
  if (_.startsWith(type, AUTH.CONNECT_FACEBOOK))
    return oauthReducer(state, action);

  if (_.startsWith(type, PREFIXES.SERVICE_API) && _.endsWith(type, SUCCESS)) {
    if (_.startsWith(type, SERVICE_API.REDEEM_MEMBERSHIP)) {
      const { payload: { data: membership } } = action;
      return { ...state, membership };
    }
    
    if (_.startsWith(type, SERVICE_API.START_TRIAL)) {
      const { payload: { data: membership } } = action;
      return { ...state, membership };
    }

    if (_.startsWith(type, SERVICE_API.GET_USER_DATA) ||
        _.startsWith(type, SERVICE_API.UPDATE_PERSONAL_INFO) ||
        _.startsWith(type, SERVICE_API.UPDATE_USER_SETTINGS) ||
        _.startsWith(type, SERVICE_API.UPLOAD_AVATAR)) {
      const { payload: { data: userData } } = action;
      return { ...state, ...buildUserStates(userData) };
    }

    if (_.startsWith(type, SERVICE_API.GET_USER_REFERRAL)) {
      const { payload: { data: referral } } = action;
      return { ...state, referral };
    }

    return checkAndUpdateAuthToken(state, action);
  }

  return state;
}
