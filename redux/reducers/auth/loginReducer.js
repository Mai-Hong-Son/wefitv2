/**
 * @providesModule WeFit.Redux.Reducers.Auth.LoginReducer
 */

import _ from 'lodash';

// Constants
import { AXIOS_REQUEST_SUFFIXES } from 'redux/constants';

// Utils
import { buildUserStates } from 'redux/utils';

const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

export default function loginReducer(state, action) {
  const { type } = action;
 
  if (_.endsWith(type, ERROR)) {
    const { error, meta: { previousAction } } = action;
    const { payload: { dataKey } } = previousAction;
    return { ...state, [dataKey]: { error, loading: false } };
  }

  if (_.endsWith(type, SUCCESS)) {
    const { payload: { data: userData }, meta: { previousAction } } = action;
    const { payload: { dataKey } } = previousAction;
    return {
      ...state,
      ...buildUserStates(userData),
      [dataKey]: { error: null, loading: false },
    };
  }

  const { payload: { dataKey } } = action;
  return { ...state, [dataKey]: { error: null, loading: true } };
}
