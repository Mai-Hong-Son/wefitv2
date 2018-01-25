/**
 * @providesModule WeFit.Redux.Reducers.Meta
 */

const DEFAULT_STATES = {
  /**
   * For redux-persist auto rehydration.
   * This state will be set to true in `createStorePersistor` when the rehydration done
   * Use this everywhere to start any initialized actions AFTER this state is true
   */
  rehydrated: false,

  /**
   * To custom redux-persist rehydration process
   * Once this value is higher than the one persisted in local storage,
   * all the states will be purged and replaced by latest states (combined of reducers' defaults)
   * This ensure our persisted states are always up-to-date.
   * Notes that we never change this value over app life-cycle.
   */
  allDataVersion: 1,
  
  // As same as `allDataVersion` but only for shared data
  sharedDataVersion: 7,

  // As same as `allDataVersion` but only for static data
  staticDataVersion: 5,
};

export default function metaReducer(state = DEFAULT_STATES) {
  return state;
}
