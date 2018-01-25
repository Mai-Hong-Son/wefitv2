/**
 * @providesModule WeFit.Redux.Actions.StaticData
 */

import { createAction } from 'redux-actions';
import Firebase from 'firebase';

// Constants
import { AXIOS_REQUEST_SUFFIXES, FIREBASE_DB_COLLECTIONS } from 'redux/constants';
import { STATIC_DATA } from 'redux/types';

// Models
import { Amenity, City, District, FitnessType } from 'app/models/BaseStaticData';
import Country from 'app/models/Country';
import RemoteConfigs from 'app/models/RemoteConfigs';
import Studio from 'app/models/Studio';

const { REMOTE_CONFIGS } = FIREBASE_DB_COLLECTIONS;
const { ERROR, SUCCESS } = AXIOS_REQUEST_SUFFIXES;

function transformResponse({ success, result }, dataKey, ModelClass) {
  if (!success) return null;
  return { [dataKey]: ModelClass.buildArray(result) };
}

function getStaticData(url, dataKey, ModelClass) {
  const action = createAction(STATIC_DATA.GET_REMOTE_DATA);

  return dispatch => {
    const transformer = data => transformResponse(data, dataKey, ModelClass);
    const request = { url, transformResponse: transformer };
    dispatch(action({ dataKey, request }));
  };
}

export const beginFetching = createAction(STATIC_DATA.BEGIN_FETCHING);
export const clearCache = createAction(STATIC_DATA.CLEAR_CACHE);
export const endFetching = createAction(STATIC_DATA.END_FETCHING);
export const loadLocalData = createAction(STATIC_DATA.LOAD_LOCAL_DATA);

export const getAmenities = () => getStaticData('/amenities/with_locales', 'amenities', Amenity);
export const getCities = () => getStaticData('/cities/with_locales', 'cities', City);
export const getCountries = () => getStaticData('/countries', 'countries', Country);
export const getDistricts = () => getStaticData('/districts/with_locales', 'districts', District);
export const getFitnessTypes = () => getStaticData(
  '/fitness_types/with_locales', 'fitnessTypes', FitnessType,
);

export function getRemoteConfigs(opts = {}) {
  const { standalone = false } = opts;
  const action = createAction(STATIC_DATA.GET_REMOTE_CONFIGS);
  const dataKey = 'remoteConfigs';

  const previousAction = action({ dataKey, standalone });
  const meta = { previousAction };
  const errorAction = createAction(STATIC_DATA.GET_REMOTE_CONFIGS + ERROR);
  const successAction = createAction(STATIC_DATA.GET_REMOTE_CONFIGS + SUCCESS);

  return async dispatch => {
    dispatch(previousAction);

    try {
      const database = Firebase.database();
      const snapshot = await database.ref(REMOTE_CONFIGS).once('value');
      const remoteConfigs = RemoteConfigs.build(snapshot.val()) || {};
      dispatch({ ...successAction({ data: { remoteConfigs } }), meta });
    } catch (error) {
      dispatch({ ...errorAction(), meta });
    }
  };
}

export function getStudiosByCity(cityCode) {
  const action = createAction(STATIC_DATA.GET_STUDIOS);
  const dataKey = `studiosByCity.${cityCode}`;

  return dispatch => {
    const request = {
      params: { city_codes: cityCode },
      transformResponse: ({ result }) => ({ [cityCode]: Studio.buildArray(result) }),
      url: '/studios/with_locales',
    };
    dispatch(action({ dataKey, request }));
  };
}
