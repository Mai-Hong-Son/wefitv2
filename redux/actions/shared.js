/**
 * @providesModule WeFit.Redux.Actions.Shared
 */

import { createAction } from 'redux-actions';
import { Extensions } from '@onaclover/react-native-utils';

// Constants
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';
import { SHARED } from 'redux/types';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

export const activateDeveloperMode = createAction(SHARED.ACTIVATE_DEVELOPER_MODE);
export const applyFilters = createAction(SHARED.APPLY_FILTERS);
export const applyArticleFilters = createAction(SHARED.APPLY_ARTICLE_FILTERS);
export const clearFilters = createAction(SHARED.CLEAR_FILTERS);
export const clearGlobalAlert = createAction(SHARED.CLEAR_GLOBAL_ALERT);
export const resetStates = createAction(SHARED.RESET_REDUX_STORE);
export const resetUserLocation = createAction(SHARED.RESET_USER_LOCATION);
export const updateStudioFavorStatus = createAction(SHARED.UPDATE_STUDIO_FAVOR);

export function changeLanguage(language) {
  const action = createAction(SHARED.CHANGE_LANGUAGE);

  return (dispatch, getState) => {
    const { shared: { language: currentLanguage } } = getState();
    if (language === currentLanguage) return;
    dispatch(action(language));
  };
}

export function showGlobalAlert({ message, meta, title, type }) {
  const action = createAction(SHARED.SHOW_GLOBAL_ALERT);
  return action({ message, meta, title, type });
}

export function requestUserLocation(requestHandler) {
  const action = createAction(SHARED.REQUEST_USER_LOCATION);
  const errorAction = createAction(SHARED.REQUEST_USER_LOCATION + ERROR);
  const successAction = createAction(SHARED.REQUEST_USER_LOCATION + SUCCESS);
  
  return async dispatch => {
    dispatch(action());

    try {
      const data = await requestHandler();
      dispatch(successAction({ data }));
    } catch (error) {
      dispatch(errorAction({ error }));
    }
  };
}

export function setGoals({ durationBasis, planName, target }) {
  const action = createAction(SHARED.SET_GOALS);

  return async dispatch => {
    await Extensions.nap(1000);
    dispatch(action({ durationBasis, planName, target }));
  };
}
