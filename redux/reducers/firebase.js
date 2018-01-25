/**
 * @providesModule WeFit.Redux.Reducers.Firebase
 */

// Constants
import { FIREBASE } from 'redux/types';

const DEFAULT_STATES = {
  fcmToken: null,
  receivedNotification: {},
};

export default function authReducer(state = DEFAULT_STATES, action) {
  const { type } = action;
  
  if (type === FIREBASE.CLEAR_TOKEN)
    return { ...state, fcmToken: null };

  if (type === FIREBASE.RECEIVE_NOTIFICATION)
    return { ...state, receivedNotification: action.payload };

  if (type === FIREBASE.REFRESH_TOKEN)
    return { ...state, fcmToken: action.payload };

  return state;
}
