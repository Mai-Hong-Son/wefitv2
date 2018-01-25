/**
 * @providesModule WeFit.Redux.Utils
 */

// Constants
import { API_CONFIGS } from 'redux/constants';

const { API_VERSION } = API_CONFIGS;

export function buildHeaders(state, opts) {
  const { auth: { authToken } = {}, shared: { language } = {} } = state || {};
  const { apiVersion = API_VERSION, languageDisabled = false } = opts || {};
  const bearerToken = authToken != null ? `Bearer ${authToken}` : undefined;

  return {
    'Accept-Language': languageDisabled === true ? undefined : language,
    Accept: `application/json; version=${apiVersion}`,
    Authorization: bearerToken,
  };
}

export function buildUserStates(userData) {
  const { auth_token: authToken, membership, referral, settings } = userData || {};
  return { authToken, membership, referral, settings, userData };
}
