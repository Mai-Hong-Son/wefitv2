/**
 * @providesModule WeFit.Components.Settings.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { settings } = state.auth;
  const { remoteConfigs } = state.staticData;
  const { userSettingsUpdate } = state.serviceApi;
  return { remoteConfigs, settings, userSettingsUpdate };
}

function mapDispatchToProps(dispatch) {
  return {
    updateUserSettings: settingsData => dispatch(serviceApi.updateUserSettings(settingsData)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
