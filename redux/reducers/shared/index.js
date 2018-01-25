/**
 * @providesModule WeFit.Redux.Reducers.Shared
 */

import { DeviceUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { AXIOS_REQUEST_SUFFIXES, DEFAULT_LANGUAGE } from 'redux/constants';
import { AUTH, PREFIXES, SERVICE_API, SHARED, STATIC_DATA } from 'redux/types';

// Locals
import globalAlertReducer, { DEFAULT_GLOBAL_ALERT } from './globalAlertReducer';
import userLocationReducer, { DEFAULT_USER_LOCATION } from './userLocationReducer';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

export const DEFAULT_ARTICLE_FILTERS = { filters: [], loading: false };
export const DEFAULT_FILTERS = { amenities: [], districts: [], fitnessTypes: [], timeRanges: [] };
export const DEFAULT_GOALS = { basis: 'week', finish: 2, target: 3 };

const DEFAULT_STATES = {
  articleFiltered: DEFAULT_ARTICLE_FILTERS,
  // To activate developer mode
  developerMode: false,

  filters: DEFAULT_FILTERS,
  
  // To show in DropdownAlert placed at app/index.js
  globalAlert: DEFAULT_GLOBAL_ALERT,
  
  goals: DEFAULT_GOALS,

  // Timestamp of last time favorite studios reloaded,
  // update this to trigger favorite studios reload
  lastFavoriteStudiosReloaded: 0,
  
  // Timestamp of last time home feeds reloaded,
  // update this to trigger home feeds reload
  lastHomeFeedsReloaded: 0,

  // Timestamp of last time schedules reloaded,
  // update this to trigger schedules reload,
  // including SessionsListing, StudiosMap & MySessions. Get by Date.now()
  lastSchedulesReloaded: 0,

  // Selected language code, use to trigger UI refresh on language changed. Default to vi-VN.
  language: DEFAULT_LANGUAGE,

  // Cached studio favorite statuses to show correctly in HeaderRightButtons
  studioFavorStatuses: {},

  // Last user location achieved
  userLocation: DEFAULT_USER_LOCATION,
};

export default function sharedReducer(state = DEFAULT_STATES, action) {
  const { type } = action;

  if (_.startsWith(type, PREFIXES.SERVICE_API)) DeviceUtils.showNetworkActivity(true);
  if (_.endsWith(type, ERROR) || _.endsWith(type, SUCCESS)) DeviceUtils.showNetworkActivity(false);

  // Activate developer mode
  if (type === SHARED.ACTIVATE_DEVELOPER_MODE)
    return { ...state, developerMode: true };

  // Clear filters on user's logging-out
  if (type === AUTH.DEAUTHORIZE)
    return { ...state, filters: DEFAULT_FILTERS };
  
  // Clear filters & reload schedules on user's switching city
  if (type === SERVICE_API.UPDATE_PERSONAL_INFO + SUCCESS) {
    const { meta: { previousAction } } = action;
    const { payload: { switchCity } } = previousAction;

    if (switchCity === true)
      return { ...state, filters: DEFAULT_FILTERS, lastSchedulesReloaded: Date.now() };
  }
    
  if (type === SHARED.CLEAR_FILTERS)
    return { ...state, filters: DEFAULT_FILTERS, lastSchedulesReloaded: Date.now() };
  
  if (type === SHARED.APPLY_FILTERS) {
    const { payload } = action;
    const { filters: currentFilters } = state;
    const filters = { ...currentFilters, ...payload };

    return { ...state, filters, lastSchedulesReloaded: Date.now() };
  }

  if (type === SHARED.APPLY_ARTICLE_FILTERS) {
    const { payload } = action;
    const { articleFiltered: currentFilters } = state;
    const articleFiltered = { ...currentFilters, ...payload };

    return { ...state, articleFiltered };
  }

  if (type === SHARED.CHANGE_LANGUAGE) {
    const { payload: language } = action;
    return {
      ...state,
      language,
      lastHomeFeedsReloaded: Date.now(),
      lastSchedulesReloaded: Date.now(),
    };
  }
  
  if (_.startsWith(type, SHARED.REQUEST_USER_LOCATION) || type === SHARED.RESET_USER_LOCATION)
    return userLocationReducer(state, action);

  // Trigger reload favorite studios on add / remove favorite of a Studio
  if (type === SERVICE_API.FAVOR_STUDIO + SUCCESS)
    return { ...state, lastFavoriteStudiosReloaded: Date.now() };

  // Trigger reload schedules on Reserve/Cancel sessions
  if (type === SERVICE_API.CANCEL_SESSION + SUCCESS ||
      type === SERVICE_API.RESERVE_SESSION + SUCCESS ||
      type === STATIC_DATA.GET_STUDIOS + SUCCESS)
    return { ...state, lastSchedulesReloaded: Date.now() };

  if (type === SHARED.UPDATE_STUDIO_FAVOR) {
    const { payload } = action;
    const { studioFavorStatuses } = state;
    return { ...state, studioFavorStatuses: { ...studioFavorStatuses, ...payload } };
  }

  if (type === SHARED.CLEAR_GLOBAL_ALERT ||
      type === SHARED.SHOW_GLOBAL_ALERT ||
      _.endsWith(type, ERROR))
    return globalAlertReducer(state, action);

  return state;
}
