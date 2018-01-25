/**
 * @providesModule WeFit.Redux.Reducers.ServiceApi.PlainDataReducer
 */

// import { Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

export default function plainDataReducer(state, action) {
  const { type } = action;

  if (_.endsWith(type, ERROR)) {
    const { meta: { previousAction }, error } = action;
    const { payload: { dataKey } } = previousAction;
    const { [dataKey]: bundle } = state;

    return { ...state, [dataKey]: { ...bundle, error, loading: false } };
  }

  if (_.endsWith(type, SUCCESS)) {
    // Extract data from action & previous action's meta
    const { meta: { previousAction }, payload: { data: newData } } = action;
    const { payload: { dataKey, appendData } } = previousAction;

    // Current data
    const { [dataKey]: bundle } = state;
    const { data: oldData } = bundle;

    // Decide to override or append data
    const data = appendData === true ? [...oldData, ...newData] : newData;

    return {
      ...state,
      [dataKey]: { ...bundle, data, hasMore: !_.isEmpty(newData), loading: false },
    };
  }

  // Reset dataKey's error & loading state on request start
  const { payload: { dataKey } = {} } = action;
  if (dataKey == null) return state;
  
  const { [dataKey]: bundle } = state;
  return { ...state, [dataKey]: { ...bundle, error: undefined, hasMore: true, loading: true } };
}
