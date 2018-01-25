/**
 * @providesModule WeFit.Components.Settings.AppInfoBox.withConnect
 */

import { connect } from 'react-redux';
import { auth, shared, staticData } from 'redux/actions';

function mapStateToProps(state) {
  const { userSettingsUpdate } = state.serviceApi;
  const { developerMode } = state.shared;
  const { expectedRequests, loadingProgress, remoteConfigs } = state.staticData;
  return { developerMode, expectedRequests, loadingProgress, remoteConfigs, userSettingsUpdate };
}

function mapDispatchToProps(dispatch) {
  return {
    activateDeveloperMode: () => dispatch(shared.activateDeveloperMode()),
    clearCache: () => dispatch(staticData.clearCache()),
    deauthorize: () => dispatch(auth.deauthorize()),
    getRemoteConfigs: () => dispatch(staticData.getRemoteConfigs({ standalone: true })),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
