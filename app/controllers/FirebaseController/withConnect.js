/**
 * @providesModule WeFit.Controllers.FirebaseController.withConnect
 */

import { connect } from 'react-redux';
import { firebase, navigations, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { authToken } = state.auth;
  const { fcmToken } = state.firebase;
  const { rehydrated } = state.meta;
  return { authToken, fcmToken, rehydrated };
}

function mapDispatchToProps(dispatch) {
  return {
    clearFilters: () => dispatch(shared.clearFilters()),
    navigateArticle: article => dispatch(navigations.navigateArticle(article)),
    navigateMainTab: tabName => dispatch(navigations.navigateMainTab(tabName)),
    navigateSession: configs => dispatch(navigations.navigateSession(configs)),
    navigateStudio: configs => dispatch(navigations.navigateStudio(configs)),
    receiveNotification: payload => dispatch(firebase.receiveNotification(payload)),
    refreshToken: fcmToken => dispatch(firebase.refreshToken(fcmToken)),
    registerDevice: fcmToken => dispatch(firebase.registerDevice(fcmToken)),
    revokeDevice: (authToken, fcmToken) => dispatch(firebase.revokeDevice(authToken, fcmToken)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
