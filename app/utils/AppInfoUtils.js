/**
 * @providesModule WeFit.Utils.AppInfoUtils
 */

import { Platform } from 'react-native';
import Communications from 'react-native-communications';
import I18n from 'react-native-i18n';
import { DeviceUtils } from '@onaclover/react-native-utils';
import semver from 'semver';
import Singleton from 'singleton';

// Utils
import { formatText } from 'app/utils';

// Locals
import AlertUtils from './AlertUtils';

class AppInfoUtils extends Singleton {
  checkAndAlertNewVersion(latestVersions) {
    const { variant, versionName: currentVersion } = DeviceUtils.buildInfo;
    const { [variant]: latestVersionInfo } = latestVersions;
    
    if (latestVersionInfo == null) {
      this.stayStill();
      return;
    }
  
    const { name: latestVersion } = latestVersionInfo;
  
    if (!semver.lt(currentVersion, latestVersion))
      this.openStore(latestVersion);
    else
      this.stayStill();
  }
  
  openStore(latestVersion) {
    const storeName = Platform.select({ android: 'Google Play Store', ios: 'Apple Store' });
  
    const storeUri = Platform.select({
      android: 'market://details?id=com.wefit.app',
      ios: 'itms-apps://itunes.apple.com/app/id1168245457',
    });
  
    const { navigateStore, message, title } = I18n.t('alerts.newVersion');
  
    AlertUtils.alert({
      buttons: [
        {
          text: formatText(navigateStore, storeName),
          onPress: (() => Communications.web(storeUri)),
        },
      ],
      message: formatText(message, latestVersion),
      title: formatText(title, latestVersion),
    });
  }

  stayStill(latestVersion) {
    const { message, title } = I18n.t('alerts.latestVersion');
    AlertUtils.alert({ title, message: formatText(message, latestVersion) });
  }
}

export default AppInfoUtils.get();
