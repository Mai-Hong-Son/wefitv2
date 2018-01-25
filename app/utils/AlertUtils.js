/**
 * @providesModule WeFitApp.Utils.AlertUtils
 */

import { Alert, Clipboard } from 'react-native';
import Singleton from 'singleton';
import _ from 'lodash';

class AlertUtils extends Singleton {
  alert({ buttons, message, title }) {
    if (title == null && message == null) return;
    Alert.alert(title, message, buttons, { cancelable: false });
  }

  copyToClipboard(text) {
    if (_.isEmpty(text)) return;
    Clipboard.setString(text);
  }
}

export default AlertUtils.get();
