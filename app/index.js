/**
 * WeFit App index
 * @providesModule WeFit.App
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import codePush from 'react-native-code-push';
import { Sentry, SentryLog } from 'react-native-sentry';
import { Provider } from 'react-redux';
import { Logger } from '@onaclover/react-native-utils';

import buildStore from 'redux/store';

// Locals
import './i18n';
import { FEATURES } from './constants/Flags';
import AppExperimentals from './components/AppExperimentals';
import AppNavigator, { reducers as navigationReducers } from './components/AppNavigator';
import {
  AppLinksController, FirebaseController, StaticDataController, UserDataController,
} from './controllers';

const { APP_EXPERIMENTALS, LOGGER, LOGGER_STACK } = FEATURES;

const SENTRY_OPTIONS = {
  deactivateStacktraceMerging: true,
  logLevel: LOGGER ? SentryLog.Debug : SentryLog.None,
};

const CODEPUSH_OPTIONS = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_SUSPEND,
};

const AppCore = APP_EXPERIMENTALS ? AppExperimentals : AppNavigator;

@codePush(CODEPUSH_OPTIONS)
export default class App extends React.PureComponent {
  constructor(props) {
    super(props);

    Logger.configure({ enabled: LOGGER, printLogStack: LOGGER_STACK });
    Sentry.config(require('app/data/configs/sentry.json').dsn, SENTRY_OPTIONS).install();
    this.store = buildStore(navigationReducers);
  }

  componentDidMount() {
    try {
      this.connectSentryCodepush();
    } catch (error) { Logger.warn(error); }
  }

  connectSentryCodepush = async () => {
    const update = await codePush.getUpdateMetadata();
    if (update) Sentry.setVersion(`codepush:${update.label}`);
  };

  render() {
    return (
      <Provider store={this.store}>
        <View style={styles.container}>
          <StatusBar backgroundColor="transparent" barStyle="light-content" translucent />
          <AppLinksController />
          <FirebaseController />
          <StaticDataController />
          <UserDataController />
          <AppCore />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
