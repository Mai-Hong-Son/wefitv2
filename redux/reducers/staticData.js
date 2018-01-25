/**
 * @providesModule WeFit.Redux.Reducers.StaticData
 */

import _ from 'lodash';

// Locals
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';
import { STATIC_DATA } from 'redux/types';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

const DEFAULT_PROGRESS = {
  expectedRequests: [],
  loadedRequests: [],
  loadingProgress: 0,
};

const DEFAULT_STATES = {
  // Raw data
  amenities: [],
  cities: [],
  countries: [],
  districts: [],
  fitnessTypes: [],
  remoteConfigs: {},
  studiosByCity: {},

  // Indexing
  fitnessTypeIndices: {},
  studioByBrandIndices: {},
  studioIndices: {},
  
  // Timestamp of last fetched data
  lastFetchedAt: 0,

  // Keys of error loading to retry later
  retryKeys: [],

  // Loading progress
  ...DEFAULT_PROGRESS,
};

function beginRequest(state, action) {
  const { payload: { dataKey, standalone } = {} } = action;
  if (standalone) return;
  
  const { expectedRequests: currentExpected, loadedRequests } = state;
  const expectedRequests = [...currentExpected, dataKey];
  const loadingProgress = loadedRequests.length / expectedRequests.length;

  return { loadingProgress, expectedRequests };
}

function endRequest(state, action) {
  const { meta: { previousAction }, type } = action;
  const { payload: { dataKey, standalone } } = previousAction;
  if (standalone) return;

  const { expectedRequests, loadedRequests: currentLoaded, retryKeys: currentRetry } = state;
  const loadedRequests = [...currentLoaded, dataKey];
  const loadingProgress = loadedRequests.length / expectedRequests.length;
  const retryKeys = _.endsWith(type, ERROR) ? _.uniq([...currentRetry, dataKey]) : currentRetry;

  return { loadedRequests, loadingProgress, retryKeys };
}

export default function staticDataReducer(state = DEFAULT_STATES, action) {
  const { payload, type } = action;

  if (type === STATIC_DATA.CLEAR_CACHE)
    return { ...state, lastFetchedAt: 0 };

  if (type === STATIC_DATA.BEGIN_FETCHING)
    return { ...state, ...DEFAULT_PROGRESS, retryKeys: [] };
  
  if (type === STATIC_DATA.END_FETCHING)
    return { ...state, ...DEFAULT_PROGRESS, lastFetchedAt: Date.now() };
  
  if (type === STATIC_DATA.LOAD_LOCAL_DATA)
    return { ...state, ...payload };

  if (_.startsWith(type, STATIC_DATA.GET_REMOTE_CONFIGS) ||
      _.startsWith(type, STATIC_DATA.GET_REMOTE_DATA) ||
      _.startsWith(type, STATIC_DATA.GET_STUDIOS)) {
    if (_.endsWith(type, ERROR))
      return { ...state, ...endRequest(state, action) };

    if (_.endsWith(type, SUCCESS)) {
      let updated = {};

      if (type === STATIC_DATA.GET_STUDIOS + SUCCESS) {
        const { payload: { data } } = action;
        const { studiosByCity: currentStudio } = state;
        const studiosByCity = { ...currentStudio, ...data };
        updated = { studiosByCity };
      } else {
        const { payload: { data } } = action;
        updated = data;
      }

      return { ...state, ...endRequest(state, action), ...updated };
    }

    return { ...state, ...beginRequest(state, action) };
  }

  return state;
}
