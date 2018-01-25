/**
 * @providesModule WeFit.Constants.Flags
 */

/* eslint-disable max-len, no-underscore-dangle */
export const IN_DEV_MODE = global.__DEV__;

export const DEBUGS = {
  CANCEL_SESSIONS:                  false,
  DIRECTIONS_ACTION_SHEET:          false,
  DISABLED_MAPS_IN_DETAIL:          IN_DEV_MODE,
  
  INTRO_SCREEN:                     false,
  LOG_DUPLICATED_NAVIGATES:         false,
  LOGOUT_IN_PERSONAL_INFO:          false,

  MEMBERSHIP_WITH_QUOTA:            false,
  PERSONAL_INFO_EDITABLE:           false,
  
  REDEEM_MEMBERSHIP:                false,
  RESERVE_SESSIONS:                 false,

  // SIMULATED_USER: {
  //   auth_token: '',
  //   id: 0,
  // },
};

export const FEATURES = {
  APP_EXPERIMENTALS:                false,
  GLOBAL_MODULES:                   true,
  
  LOGGER:                           true,
  LOGGER_STACK:                     false,
  
  NON_ANIMATED_SPLASH_SCREEN:       true,
  
  SESSION_STORY:                    false,
  SHARE_SESSIONS_STUDIOS:           false,
  STUDIOS_COUNT_ON_CITY_SELECT:     false,
  
  TRAINING_GOALS:                   false,
};

/* eslint-enable max-len, no-underscore-dangle */
