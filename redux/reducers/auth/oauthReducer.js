/**
 * @providesModule WeFit.Redux.Reducers.Auth.OauthReducer
 */

// import { Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

export default function oauthReducer(state, action) {
  const { payload: { accessToken, dataKey, error, fromScene }, type } = action;
  const { [dataKey]: currentState } = state;

  if (_.endsWith(type, ERROR))
    return { ...state, [dataKey]: { ...currentState, error, accessToken: null, loading: false } };
  
  if (_.endsWith(type, SUCCESS))
    return { ...state, [dataKey]: { ...currentState, accessToken, loading: false } };

  return { ...state, [dataKey]: { ...currentState, fromScene, error: null, loading: true } };
}
