/**
 * @providesModule WeFit.Redux.Store.axiosMiddleware
 */

import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Actions
import { auth } from 'redux/actions';

// Constants
import { API_CONFIGS, AXIOS_REQUEST_SUFFIXES } from 'redux/constants';
import { IN_DEV_MODE } from 'redux/flags';

const { API_VERSION, BASE_URI, RESPONSE_STATUSES } = API_CONFIGS;
const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

const axiosClient = axios.create({
  baseURL: BASE_URI,
  headers: { Accept: `application/json; version=${API_VERSION}` },
  responseType: 'json',
});

function buildErrorMessage(errors) {
  if (_.isEmpty(errors)) return null;
  const transformer = ({ code, message }) => (IN_DEV_MODE ? `${code} - ${message}` : message);
  return _.map(errors, transformer).join(', ');
}

export default axiosMiddleware(axiosClient, {
  errorSuffix: ERROR,
  interceptors: {
    response: [{
      error: (configs, request) => {
        const { dispatch } = configs;
        const { request: { response: { errors } = {}, status } = {} } = request;
        const message = buildErrorMessage(errors) || request.message;

        if (status === RESPONSE_STATUSES.UNAUTHORIZED)
          dispatch(auth.deauthorize());

        return Promise.reject({ ...request, message });
      },
      success: (configs, request) => {
        const { config: { logging } = {} } = request;
        if (logging) Logger.debug(request);
        return request;
      },
    }],
  },
  successSuffix: SUCCESS,
});
