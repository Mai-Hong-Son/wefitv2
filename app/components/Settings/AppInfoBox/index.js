/**
 * @providesModule WeFit.Components.Settings.AppInfoBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import { DeviceUtils, FontUtils, Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Models
import RemoteConfigs from 'app/models/RemoteConfigs';

// Utils
import { formatText } from 'app/utils';
import AlertUtils from 'app/utils/AlertUtils';
import AppInfoUtils from 'app/utils/AppInfoUtils';

// Locals
import withConnect from './withConnect';

const CHECK_TIMEOUT = 5000; // 5 seconds
const SLUG = '¯\\_(ツ)_/¯';

@withConnect
export default class AppInfoBox extends React.PureComponent {
  static propTypes = {
    activateDeveloperMode: PropTypes.func.isRequired,
    clearCache: PropTypes.func.isRequired,
    deauthorize: PropTypes.func.isRequired,
    developerMode: PropTypes.bool.isRequired,
    expectedRequests: PropTypes.arrayOf(PropTypes.string).isRequired,
    getRemoteConfigs: PropTypes.func.isRequired,
    loadingProgress: PropTypes.number.isRequired,
    remoteConfigs: PropTypes.instanceOf(RemoteConfigs).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
  };

  static defaultProps = {
    checkingUpdate: false,
    developerModeCount: -1,
  };

  constructor(props) {
    super(props);

    this.activateDeveloperMode = this.props.activateDeveloperMode.bind(this);
    this.clearCache = this.props.clearCache.bind(this);
    this.deauthorize = this.props.deauthorize.bind(this);
    this.getRemoteConfigs = this.props.getRemoteConfigs.bind(this);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
    
    this.checkForUpdateTimeout = null;
    this.developerModeCount = 6;
    
    this.state = { checkingUpdate: false };
  }

  componentWillReceiveProps(nextProps) {
    const { remoteConfigs } = this.props;
    const { remoteConfigs: nextRemoteConfigs } = nextProps;

    if (remoteConfigs !== nextRemoteConfigs)
      this.alertUpdateCheckResults(nextRemoteConfigs);
  }

  get buildInfo() {
    const { versionName } = DeviceUtils.buildInfo;
    const { buildNumber } = require('../../../../gulp-helpers/codepush/configs.json');

    if (_.isEmpty(versionName)) return null;

    return _.compact([
      formatText(I18n.t('settings.appInfo.version'), versionName),
      buildNumber != null && `(build-${buildNumber})`,
    ]).join(' ');
  }

  alertUpdateCheckResults = remoteConfigs => {
    if (!this.state.checkingUpdate) return;
    
    this.setState({ checkingUpdate: false });
    if (remoteConfigs == null) return;

    clearTimeout(this.checkForUpdateTimeout);
    const { latest_versions: versions } = remoteConfigs;
    AppInfoUtils.checkAndAlertNewVersion(versions);
  };

  onCheckForUpdate = () => {
    this.setState({ checkingUpdate: true });
    this.checkForUpdateTimeout = setTimeout(() => this.alertUpdateCheckResults(), CHECK_TIMEOUT);
    this.getRemoteConfigs();
  };

  onClearCache = () => _.isEmpty(this.props.expectedRequests) && this.clearCache();

  onLogOut = () => {
    const { cancel, confirm, message, thanksForStay, title } = I18n.t('settings.logout');

    AlertUtils.alert({
      message,
      title,
      buttons: [
        { text: confirm, onPress: this.deauthorize, style: 'cancel' },
        {
          text: cancel,
          onPress: () => this.showGlobalAlert({
            title: thanksForStay,
            type: GLOBAL_ALERT_TYPES.INFO,
          }),
        },
      ],
    });
  };

  onTryActivateDevMode = () => {
    if (this.props.developerMode) return;
    
    if (this.developerModeCount > 0) {
      Logger.log(`Activate developer mode after ${this.developerModeCount} taps`);
      this.developerModeCount -= 1;
      return;
    }

    this.showGlobalAlert({ title: SLUG, type: GLOBAL_ALERT_TYPES.INFO });
    this.activateDeveloperMode();
  };

  render() {
    const { loadingProgress, expectedRequests } = this.props;
    const { checkingUpdate } = this.state;
    const { checkForUpdate, clearCache, logout, updating } = I18n.t('settings.appInfo');
    const clearCacheTitle = _.isEmpty(expectedRequests)
      ? clearCache : formatText(updating, `${Math.ceil(loadingProgress * 100)}%`);

    return (
      <View style={styles.container}>
        <TextButton
          bordering
          containerStyle={styles.borderingButton}
          loading={checkingUpdate}
          onPress={this.onCheckForUpdate}
          short
          title={checkForUpdate}
        />
        <TextButton
          bordering
          containerStyle={styles.borderingButton}
          onPress={this.onClearCache}
          short
          title={clearCacheTitle}
        />
        <Button onPress={this.onLogOut} style={styles.buttonText}>{logout}</Button>
        {this.buildInfo != null && (
          <TouchableWithoutFeedback onPress={this.onTryActivateDevMode}>
            <View>
              <Text style={styles.buildInfo}>{this.buildInfo}</Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  buttonText: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 17,
    weight: 'semibold',
  }),

  borderingButton: {
    marginBottom: 10,
  },

  buildInfo: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 11,
    style: 'italic',

    // Extra
    marginTop: 20,
  }),
});
