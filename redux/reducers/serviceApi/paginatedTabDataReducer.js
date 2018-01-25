/**
 * @providesModule WeFit.Redux.Reducers.ServiceApi.PaginatedTabDataReducer
 */

import _ from 'lodash';

// Constants
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

export default function paginatedTabDataReducer(state, action) {
  const { type } = action;

  if (_.endsWith(type, ERROR)) {
    const { error, meta: { previousAction } } = action;
    const { payload: { dataKey, tabId } } = previousAction;
    const { [dataKey]: currentData } = state;
    const { [tabId]: bundle } = currentData;
    
    return {
      ...state,
      [dataKey]: {
        ...currentData,
        [tabId]: { ...bundle, error, hasMore: false, loading: false },
      },
    };
  }
  
  if (_.endsWith(type, SUCCESS)) {
    const { meta: { previousAction }, payload: { data: newData } } = action;
    const { payload: { appendData, dataKey, tabId } } = previousAction;
    const { [dataKey]: currentData } = state;
    const { [tabId]: bundle } = currentData;

    // Current data
    const { data: oldData } = bundle;

    // Decide to override or append data
    const data = appendData === true ? [...oldData, ...newData] : newData;
    
    return {
      ...state,
      [dataKey]: {
        ...currentData,
        [tabId]: { ...bundle, data, hasMore: !_.isEmpty(newData), loading: false },
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
      [tabId]: { ...bundle, error: null, hasMore: true, loading: true },
    },
  };
}
