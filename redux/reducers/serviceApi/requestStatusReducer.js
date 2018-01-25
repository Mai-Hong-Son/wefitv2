/**
 * @providesModule WeFit.Redux.Reducers.ServiceApi.RequestStatusReducer
 */

// import { Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';
import { PREFIXES } from 'redux/types';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

export default function requestStatusReducer(state, action) {
  const { type } = action;
  
  if (_.endsWith(type, ERROR)) {
    const { meta: { previousAction }, error } = action;
    const { payload: { dataKey } } = previousAction;
    const { [dataKey]: currentState } = state;
    return { ...state, [dataKey]: { ...currentState, error, loading: false, progress: 0 } };
  }
  
  if (_.endsWith(type, SUCCESS)) {
    const { meta: { previousAction } } = action;
    const { payload: { dataKey } } = previousAction;
    const { [dataKey]: currentState } = state;
    return { ...state, [dataKey]: { ...currentState, loading: false } };
  }

  if (_.startsWith(type, PREFIXES.SERVICE_API)) {
    const { payload: { dataKey, progress } } = action;
    const { [dataKey]: currentState } = state;
    return {
      ...state,
      [dataKey]: {
        ...currentState,
        error: null,
        loading: true,
        progress: progress || 0,
      },
    };
  }
  
  return state;
}
