/**
 * @providesModule WeFit.Redux.Actions.ServiceApi.Schedules
 */

import { createAction } from 'redux-actions';

// Models
import Session from 'app/models/Session';

// Constants
import { DEBUGS } from 'redux/flags';
import { API_CONFIGS } from 'redux/constants';
import { SERVICE_API } from 'redux/types';

// Utils
import { serializeDateParams, serializeFilterParams } from 'app/utils/FilterHelpers';
import { buildHeaders } from 'redux/utils';

const { PAGINATION } = API_CONFIGS;
const { EMPTY_MY_SESSIONS, EMPTY_OVERALL_SCHEDULES, EMPTY_STUDIO_SCHEDULES } = DEBUGS;

export function getMySessions({ tabId }) {
  const action = createAction(SERVICE_API.GET_MY_SESSIONS);
  const dataKey = 'mySessions';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      headers: buildHeaders(state),
      params: { status: tabId },
      transformResponse: ({ result }) => (EMPTY_MY_SESSIONS ? [] : Session.buildArray(result)),
      url: `/users/${userId}/sessions`,
    };

    dispatch(action({ dataKey, request, tabId }));
  };
}

export function getOverallSchedules({ dateId, page = 1, tabId }) {
  const action = createAction(SERVICE_API.GET_OVERALL_SCHEDULES);
  const appendData = page > 1;
  const dataKey = 'overallSchedules';

  return (dispatch, getState) => {
    const state = getState();
    const {
      auth: { userData: { city_code: cityCode } },
      shared: { filters, userLocation: { data: userLocationData } },
    } = state;

    const dateParams = serializeDateParams(dateId);
    const filterParams = serializeFilterParams(filters);
    const userLocation = userLocationData == null ? undefined : userLocationData.toParams;

    const request = {
      headers: buildHeaders(state),
      params: {
        ...dateParams,
        ...filterParams,
        page,
        city_code: cityCode,
        per_page: PAGINATION,
        user_location: userLocation,
      },
      transformResponse: ({ result }) => (
        EMPTY_OVERALL_SCHEDULES ? [] : Session.buildArray(result)
      ),
      url: '/sessions',
    };

    dispatch(action({ appendData, dataKey, request, tabId }));
  };
}

export function getStudioSchedules({ dateId, page = 1, studioId, tabId }) {
  const action = createAction(SERVICE_API.GET_STUDIO_SCHEDULES);
  const appendData = page > 1;
  const dataKey = 'studioSchedules';

  return (dispatch, getState) => {
    const state = getState();

    const dateParams = serializeDateParams(dateId);

    const request = {
      headers: buildHeaders(state),
      params: { page, per_page: PAGINATION, studio_ids: studioId, ...dateParams },
      transformResponse: ({ result }) => (EMPTY_STUDIO_SCHEDULES ? [] : Session.buildArray(result)),
      url: '/sessions',
    };

    dispatch(action({ appendData, dataKey, request, tabId }));
  };
}

export function getStudiosMap({ dateId, tabId }) {
  const action = createAction(SERVICE_API.GET_STUDIOS_MAP);
  const dataKey = 'studiosMap';

  return (dispatch, getState) => {
    const state = getState();
    const { shared: { filters } } = state;

    const dateParams = serializeDateParams(dateId);
    const filterParams = serializeFilterParams(filters);

    const request = {
      headers: buildHeaders(state),
      params: { ...dateParams, ...filterParams },
      transformResponse: ({ result }) => result,
      url: '/studios/session_count',
    };

    dispatch(action({ dataKey, request, tabId }));
  };
}
