/**
 * @providesModule WeFit.Redux.Reducers.ServiceApi.SingleTabDataReducer
 */

import _ from 'lodash';

// Constants
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

export default function singleTabDataReducer(state, action) {
  const { type } = action;

  if (_.endsWith(type, ERROR)) {
    const { meta: { previousAction }, error } = action;
    const { payload: { dataKey, tabId } } = previousAction;
    const { [dataKey]: currentData } = state;
    const { [tabId]: bundle } = currentData;
    
    return {
      ...state,
      [dataKey]: {
        ...currentData,
        [tabId]: { ...bundle, error, loading: false },
      },
    };
  }
  
  if (_.endsWith(type, SUCCESS)) {
    const { meta: { previousAction }, payload: { data } } = action;
    const { payload: { dataKey, tabId } } = previousAction;
    const { [dataKey]: currentData } = state;
    const { [tabId]: bundle } = currentData;
    
    return {
      ...state,
      [dataKey]: {
        ...currentData,
        [tabId]: { ...bundle, data, loading: false },
      },
    };
  }

  // Reset dataKey's error & loading state on request start
  const { payload: { dataKey, tabId } } = action;
  const { [dataKey]: currentData } = state;
  const { [tabId]: bundle } = currentData;

  return {
    ...state,
    [dataKey]: {
      ...currentData,
      [tabId]: { ...bundle, error: null, loading: true },
    },
  };
}
