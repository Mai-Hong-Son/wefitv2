/**
 * @providesModule WeFit.Redux.Flags
 */

/* eslint-disable no-underscore-dangle */
export const IN_DEV_MODE = global.__DEV__;
/* eslint-enable no-underscore-dangle */

export const DEBUGS = {
  EMPTY_MY_SESSIONS:                false,
  EMPTY_OVERALL_SCHEDULES:          false,
  EMPTY_STUDIO_SCHEDULES:           false,

  UNAUTHORIZED:                     false,
  UPLOAD_AVATAR_FAILED:             false,
};

export const FEATURES = {
  REDUX_PERSIST_LOGGING:            false,
};
