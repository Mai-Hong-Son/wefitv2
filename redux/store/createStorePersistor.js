/**
 * @providesModule WeFit.Redux.Store.createStorePersistor
 */

import { AsyncStorage, Platform } from 'react-native';
import { Logger } from '@onaclover/react-native-utils';
import { createPersistor, createTransform, getStoredState } from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import _ from 'lodash';

// Constants
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from 'redux/constants';
import { DEBUGS } from 'redux/flags';

// Models
import { Amenity, City, District, FitnessType } from 'app/models/BaseStaticData';
import Country from 'app/models/Country';
import Location from 'app/models/Location';
import RemoteConfigs from 'app/models/RemoteConfigs';
import Studio from 'app/models/Studio';
import TimeRange from 'app/models/TimeRange';
import User from 'app/models/User';

function buildUserData(rawUserData) {
  if (DEBUGS.UNAUTHORIZED) return null;
  if (_.isEmpty(DEBUGS.SIMULATED_USER)) return User.build(rawUserData);
  return User.build({ ...rawUserData, ...DEBUGS.SIMULATED_USER });
}

// Persist to local storage
function inboundTransform(partialState, key) {
  if (key === 'auth')
    return {
      ...partialState,
      authToken: undefined,
      emailAuth: undefined,
      facebookOauth: undefined,
      membership: undefined,
      referral: undefined,
      settings: undefined,
      socialAuth: undefined,
    };

  // Exclude `rehydrated` state from being persisted
  if (key === 'meta')
    return { ...partialState, rehydrated: undefined };
  
  if (key === 'shared')
    return { ...partialState, globalAlert: undefined };
  
  if (key === 'staticData')
    return {
      ...partialState,
      fitnessTypeIndices: undefined,
      studioByBrandIndices: undefined,
      studioIndices: undefined,
      errorKey: undefined,
    };

  return partialState;
}

// Rehydrate from local storage
function outboundTransform(partialState, key) {
  if (partialState == null) return null;

  if (key === 'auth') {
    const { userData: rawUserData } = partialState;
    const userData = buildUserData(rawUserData);
    const { auth_token: authToken, membership, referral, settings } = userData || {};
    return { ...partialState, authToken, membership, referral, settings, userData };
  }
  
  if (key === 'shared') {
    const {
      filters: { amenities, districts, fitnessTypes, timeRanges },
      language, userLocation: { data } = {},
    } = partialState;

    // Check if current language is available or not, fallback to vi-VN
    const availableLanguageCodes = _.map(AVAILABLE_LANGUAGES, 'code');
    const lang = _.includes(availableLanguageCodes, language) ? language : DEFAULT_LANGUAGE;

    return {
      ...partialState,
      filters: {
        amenities: Amenity.buildArray(amenities),
        districts: District.buildArray(districts),
        fitnessTypes: FitnessType.buildArray(fitnessTypes),
        timeRanges: TimeRange.buildArray(timeRanges),
      },
      language: lang,
      userLocation: {
        data: Location.build(data),
        error: null,
        loading: false,
      },
    };
  }

  if (key === 'staticData') {
    const {
      amenities, cities, countries, districts, fitnessTypes, remoteConfigs,
      studiosByCity: rawStudiosByCity,
    } = partialState;

    const studiosByCity = _.fromPairs(
      _.map(rawStudiosByCity, (studios, city) => [city, Studio.buildArray(studios)])
    );

    return {
      ...partialState,
      studiosByCity,
      amenities: Amenity.buildArray(amenities),
      cities: City.buildArray(cities),
      countries: Country.buildArray(countries),
      districts: District.buildArray(districts),
      fitnessTypes: FitnessType.buildArray(fitnessTypes),
      remoteConfigs: RemoteConfigs.build(remoteConfigs) || {},

      // Indexing
      fitnessTypeIndices: {},
      studioByBrandIndices: {},
      studioIndices: {},

      // Keys of error loading to retry later
      retryKeys: [],

      // Loading progress
      expectedRequests: [],
      loadedRequests: [],
      loadingProgress: 0,
    };
  }

  return partialState;
}

export default function createStorePersistor(store) {
  const defaultState = store.getState();

  const configs = {
    blacklist: ['appRouter', 'mainRouter', 'rootRouter', 'serviceApi'],
    storage: Platform.select({
      /**
       * To mitigate storage size limitations on Android 
       *  - https://github.com/rt2zz/redux-persist/issues/199
       *  - https://github.com/rt2zz/redux-persist/issues/284
       */
      android: FilesystemStorage,
      ios: AsyncStorage,
    }),
    transforms: [createTransform(inboundTransform, outboundTransform)],
  };

  getStoredState(configs, async (err, persistedState) => {
    const persistor = createPersistor(store, configs);
    
    const { meta: {
      allDataVersion: latestAllDataVersion,
      sharedDataVersion: latestSharedDataVersion,
      staticDataVersion: latestStaticDataVersion,
    } = {} } = defaultState;

    const { meta: {
      allDataVersion: currentAllDataVersion = 0,
      sharedDataVersion: currentSharedDataVersion = 0,
      staticDataVersion: currentStaticDataVersion = 0,
    } = {} } = persistedState || {};

    const { meta, shared, staticData } = defaultState;
    const purgedKeys = [];
    const newMeta = { ...meta };
    const newPersistedState = { ...persistedState };

    // Check & remove all data if needed
    if (parseInt(currentAllDataVersion) < parseInt(latestAllDataVersion)) {
      Logger.log(`Purging all data...(current version: ${currentAllDataVersion}, \
latest version: ${latestAllDataVersion})`);

      // Purge all data
      await persistor.purge();
      await persistor.rehydrate(defaultState);
      
      // Mark that the rehydration is done
      await persistor.rehydrate({ meta: { rehydrated: true } });
      return;
    }

    // Check and purge persisted states if data versions not match
    if (parseInt(currentSharedDataVersion) < parseInt(latestSharedDataVersion)) {
      Logger.log(`Purging shared data...(current version: ${currentSharedDataVersion}, \
latest version: ${latestSharedDataVersion})`);

      purgedKeys.push('shared');
      newMeta.sharedDataVersion = latestSharedDataVersion;
      newPersistedState.shared = shared;
    }
    
    if (parseInt(currentStaticDataVersion) < parseInt(latestStaticDataVersion)) {
      Logger.log(`Purging static data...(current version: ${currentStaticDataVersion}, \
latest version: ${latestStaticDataVersion})`);

      purgedKeys.push('staticData');
      newMeta.staticDataVersion = latestStaticDataVersion;
      newPersistedState.staticData = staticData;
    }

    // Update latest meta
    newPersistedState.meta = newMeta;
    
    // Purge keys & rehydrate persisted state
    await persistor.purge(purgedKeys);
    await persistor.rehydrate(newPersistedState);

    // Mark that the rehydration is done
    await persistor.rehydrate({ meta: { rehydrated: true } });
  });
}
