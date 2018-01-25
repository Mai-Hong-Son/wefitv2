/**
 * @providesModule WeFit.Redux.Reducers.Shared.UserLocationReducer
 */

import I18n from 'react-native-i18n';
import _ from 'lodash';

// Constants
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';
import { SHARED } from 'redux/types';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

export const DEFAULT_USER_LOCATION = { data: null, error: null, loading: false };

export default function userLocationReducer(state, action) {
  const { type } = action;

  if (type === SHARED.RESET_USER_LOCATION)
    return { ...state, userLocation: DEFAULT_USER_LOCATION };
  
  if (_.endsWith(type, ERROR)) {
    const { payload: { error } } = action;
    const { message } = error;
    const title = I18n.t('globalAlert.userLocation');

    return {
      ...state,
      globalAlert: { title, message: message || error, type: 'error' },
      userLocation: { error, loading: false },
    };
  }

  if (_.endsWith(type, SUCCESS)) {
    const { payload: { data } } = action;
    return { ...state, userLocation: { data, loading: false } };
  }

  if (type === SHARED.REQUEST_USER_LOCATION)
    return { ...state, userLocation: { data: null, error: null, loading: true } };
}
