/**
 * @providesModule WeFit.Redux.Actions.Firebase
 */

import { createAction } from 'redux-actions';
import _ from 'lodash';

// Constants
import { FIREBASE } from 'redux/types';

// Utils
import { buildHeaders } from 'redux/utils';

export const clearToken = createAction(FIREBASE.CLEAR_TOKEN);
export const receiveNotification = createAction(FIREBASE.RECEIVE_NOTIFICATION);
export const refreshToken = createAction(FIREBASE.REFRESH_TOKEN);

export function registerDevice(fcmToken) {
  const action = createAction(FIREBASE.REGISTER_DEVICE);

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData } } = getState();
    const { id: userId } = userData || {};

    if (_.isEmpty(fcmToken) || userData == null) return;

    const request = {
      data: { fcm_token: fcmToken },
      headers: buildHeaders(state),
      method: 'post',
      url: `/users/${userId}/devices`,
    };
    
    dispatch(action({ request }));
  };
}

export function revokeDevice(authToken, fcmToken) {
  const action = createAction(FIREBASE.REVOKE_DEVICE);

  return dispatch => {
    if (_.isEmpty(authToken) || _.isEmpty(fcmToken)) return;

    const request = {
      data: { fcm_token: fcmToken },
      headers: { Authorization: `Bearer ${authToken}` },
      method: 'delete',
      url: '/logout',
    };
    
    dispatch(action({ request }));
  };
}
