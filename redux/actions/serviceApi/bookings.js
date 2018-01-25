/**
 * @providesModule WeFit.Redux.Actions.ServiceApi.Bookings
 */

import { createAction } from 'redux-actions';

// Models
import Reservation from 'app/models/Reservation';

// Constants
import { SERVICE_API } from 'redux/types';

// Utils
import { buildHeaders } from 'redux/utils';

export function cancelSession(sessionId) {
  const action = createAction(SERVICE_API.CANCEL_SESSION);
  const dataKey = 'sessionCancel';

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      method: 'post',
      transformResponse: ({ result }) => Reservation.build(result),
      url: `/sessions/${sessionId}/cancel`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function reserveSession(sessionId) {
  const action = createAction(SERVICE_API.RESERVE_SESSION);
  const dataKey = 'sessionReserve';

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      method: 'post',
      transformResponse: ({ result }) => Reservation.build(result),
      url: `/sessions/${sessionId}/reserve`,
    };

    dispatch(action({ dataKey, request }));
  };
}
