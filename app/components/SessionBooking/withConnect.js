/**
 * @providesModule WeFit.Components.SessionBooking.withConnect
 */

import { connect } from 'react-redux';
import { navigations, serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { mainRouter: router } = state;
  const { sessionCancel, sessionReserve } = state.serviceApi;
  return { router, sessionCancel, sessionReserve };
}

function mapDispatchToProps(dispatch) {
  return {
    cancelSession: sessionId => dispatch(serviceApi.cancelSession(sessionId)),
    navigateMainTab: tabName => dispatch(navigations.navigateMainTab(tabName)),
    reserveSession: sessionId => dispatch(serviceApi.reserveSession(sessionId)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
