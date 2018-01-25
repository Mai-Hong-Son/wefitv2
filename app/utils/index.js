/**
 * @providesModule WeFit.Utils
 */

import { Platform } from 'react-native';
import I18n from 'react-native-i18n';
import { DeviceUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { APP_CONFIGS, PATTERNS } from 'app/constants/AppConstants';

// Models
import Location from 'app/models/Location';

export function buildWeekDayFormat() {
  const { shortDate, weekDay: { long, short } } = I18n.t('formats');
  const { width: screenWidth } = DeviceUtils.screen;
  const wideScreen = Platform.select({ android: screenWidth > 350, ios: screenWidth > 320 });
  const weekDayTemplate = wideScreen ? long : short;
  return { date: shortDate, weekDay: weekDayTemplate };
}

export function debounced(func) {
  return _.debounce(func, APP_CONFIGS.DEBOUNCED_TIME, { leading: true, trailing: false });
}

export function formatText(template, ...args) {
  const plainTexts = template.split(PATTERNS.FORMAT_TEXT_PATTERN);
  const indicies = _.map(template.match(PATTERNS.EXTRACT_INDEX_PATTERN), _.toInteger);
  const replaceTexts = _.map(indicies, idx => {
    const argItem = args[idx];
    return argItem == null ? '' : String(argItem);
  });
  
  const pairs = _.zip(plainTexts, replaceTexts);
  const resultParts = _.compact(_.concat(...pairs));
  return resultParts.join('');
}

/* eslint-disable */
function patchPostMessageFunction() {
  var originalPostMessage = window.postMessage;

  var patchedPostMessage = function(message, targetOrigin, transfer) { 
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() { 
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };

  window.postMessage = patchedPostMessage;
}
/* eslint-enable */

export const patchPostMessageJsCode = `(${String(patchPostMessageFunction)}))();`;

export function requestLocation() {
  return new Promise((resolve, reject) => {
    const onSuccess = location => {
      const data = Location.build(location.coords);
      if (data != null) resolve(data);
      reject(I18n.t('reusables.userLocationError'));
    };

    const onFail = error => reject(error);

    const options: Object = {
      enableHighAccuracy: DeviceUtils.platformIsIOS,
      maximumAge: 1000,
      timeout: 20000,
    };

    global.navigator.geolocation.getCurrentPosition(onSuccess, onFail, options);
  });
}
