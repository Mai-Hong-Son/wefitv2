/**
 * @providesModule WeFit.Redux.Actions.ServiceApi.Studios
 */

import { createAction } from 'redux-actions';

// Constants
import { SERVICE_API } from 'redux/types';

// Utils
import { buildHeaders } from 'redux/utils';

export function favorStudio({ favorited, studioId }) {
  const action = createAction(SERVICE_API.FAVOR_STUDIO);
  const dataKey = 'studioFavorUpdate';

  return (dispatch, getState) => {
    const method = favorited ? 'post' : 'delete';

    const request = {
      method,
      headers: buildHeaders(getState()),
      url: `/studios/${studioId}/favor`,
    };

    dispatch(action({ dataKey, request, studioId }));
  };
}

export function getFavoriteStudios() {
  const action = createAction(SERVICE_API.GET_FAVORITE_STUDIOS);
  const dataKey = 'favoriteStudios';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      headers: buildHeaders(state),
      transformResponse: ({ result }) => result,
      url: `users/${userId}/studios`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function getStudioDetail(studioId) {
  const action = createAction(SERVICE_API.GET_STUDIOS_DETAIL);
  const dataKey = 'studioDetail';

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      transformResponse: ({ result }) => result,
      url: `studios/${studioId}`,
    };

    dispatch(action({ dataKey, request }));
  };
}
