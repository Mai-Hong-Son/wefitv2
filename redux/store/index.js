/**
 * @providesModule WeFit.Redux.Store
 */

/* eslint-disable no-underscore-dangle */

import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { autoRehydrate } from 'redux-persist';
import reduxReset from 'redux-reset';
import reduxThunk from 'redux-thunk';

// Locals
import { FEATURES } from '../flags';
import { auth, firebase, meta, serviceApi, shared, staticData } from '../reducers';
import { SHARED } from '../types';
import axiosMiddleware from './axiosMiddleware';
import createStorePersistor from './createStorePersistor';
import screenTracking from './../../app/components/AppNavigator/trackingScreen';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function buildStore(customReducers) {
  const reducers = combineReducers({
    auth, firebase, meta, serviceApi, shared, staticData, ...customReducers,
  });

  const store = createStore(
    reducers,
    composeEnhancer(
      applyMiddleware(reduxThunk, axiosMiddleware, screenTracking),
      autoRehydrate({ log: FEATURES.REDUX_PERSIST_LOGGING }),
      reduxReset(SHARED.RESET_REDUX_STORE)
    )
  );
  
  createStorePersistor(store);
  return store;
}

/* eslint-enable no-underscore-dangle */
