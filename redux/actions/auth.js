/**
 * @providesModule WeFit.Redux.Actions.Auth
 */

import { createAction } from 'redux-actions';

// Constants
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';
import { AUTH } from 'redux/types';

// Models
import User from 'app/models/User';

// Utils
import { buildHeaders } from 'redux/utils';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

export const deauthorize = createAction(AUTH.DEAUTHORIZE);
export const updateMembership = createAction(AUTH.UPDATE_MEMBERSHIP);

export function connectFacebook({ fromScene, loginHandler }) {
  const action = createAction(AUTH.CONNECT_FACEBOOK);
  const errorAction = createAction(AUTH.CONNECT_FACEBOOK + ERROR);
  const successAction = createAction(AUTH.CONNECT_FACEBOOK + SUCCESS);
  const dataKey = 'facebookOauth';

  return async dispatch => {
    dispatch(action({ dataKey, fromScene }));

    try {
      const accessToken = await loginHandler();
      dispatch(successAction({ accessToken, dataKey }));
    } catch (error) {
      dispatch(errorAction({ dataKey, error }));
    }
  };
}

export function loginWithEmail({ email, password }) {
  const action = createAction(AUTH.LOGIN_EMAIL);
  const dataKey = 'emailAuth';

  return (dispatch, getState) => {
    const request = {
      data: { email, password },
      headers: buildHeaders(getState(), { apiVersion: 'v2' }),
      method: 'post',
      transformResponse: ({ result }) => User.build(result),
      url: '/users/login',
    };

    dispatch(action({ dataKey, request }));
  };
}

export function loginWithSocialAccount(accessToken) {
  const action = createAction(AUTH.LOGIN_SOCIAL);
  const dataKey = 'socialAuth';

  return (dispatch, getState) => {
    const request = {
      data: { access_token: accessToken },
      headers: buildHeaders(getState, { apiVersion: 'v2' }),
      method: 'post',
      transformResponse: ({ result }) => User.build(result),
      url: '/users/auth',
    };

    dispatch(action({ dataKey, request }));
  };
}

export function signUpWithEmail({ email, password }) {
  const action = createAction(AUTH.SIGN_UP_EMAIL);
  const dataKey = 'emailAuth';

  return (dispatch, getState) => {
    const request = {
      data: { email, password },
      headers: buildHeaders(getState(), { apiVersion: 'v2' }),
      method: 'post',
      transformResponse: ({ result }) => User.build(result),
      url: '/users/registration',
    };

    dispatch(action({ dataKey, request }));
  };
}
