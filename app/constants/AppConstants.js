/**
 * @providesModule WeFit.Constants.AppConstants
 */

// import { Platform } from 'react-native';

export const APP_CONFIGS = {
  DEBOUNCED_TIME: 250,
  DEFAULT_LOCATIONS: {
    HCM: { latitude: 10.7719233, longitude: 106.6961583 },
    HN: { latitude: 21.010586, longitude: 105.849160 },
  },
  MAP_SCALE: { latitudeDelta: 0.015, longitudeDelta: 0.015 },
  NAVIGATION_DISPATCH_THROTTLE: 1000,
  STATIC_DATA_EXPIRED_AFTER: 60 * 60 * 1000, // 60 minutes
  URI_PREFIX: 'wefitapp://',
  URI_PROTOCOL: 'wefitapp:',
  WEEKDAY_TABS_COUNT: 7,
};

export const DUMMY = {
  DEFAULT_SECTION_ID: '___DEFAULT-SECTION-ID___',
  EMPTY_DATA: '___EMPTY-DATA___',
  PLACEHOLDER_DATA: '___PLACEHOLDER-DATA___',
};

// Date & time formats
export const FORMATS = {
  CURRENCY_SUFFIX: ' VNĐ',
  DATE_ID: 'YYYY-MM-DD',
  DATE_TITLE: 'dddd, DD/MM',
  EXPIRATION_DATE: 'DD/MM/YYYY',
  JSON_DATE: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  JSON_DATE_ISO: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  TIME: 'HH:mm',
};

export const PATTERNS = {
  ACTIVATION_CODE: /^[A-Za-z0-9]{6}$/g,
  EMAIL: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g,
  EXTRACT_INDEX_PATTERN: /(?!{)\d+(?=})/ig,
  FORMAT_TEXT_PATTERN: /{\d+}/g,
  PASSWORD_LENGTH: { MAX: 16, MIN: 8 },
  PHONE: /^[+\s0-9]+$/g,
};
