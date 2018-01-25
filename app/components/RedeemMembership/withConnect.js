/**
 * @providesModule WeFit.Components.RedeemMembership.withConnect
 */

import { connect } from 'react-redux';
import { navigations, serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { mainRouter, rootRouter } = state;
  const { membership, userData } = state.auth;
  const { membershipActivation } = state.serviceApi;
  const { remoteConfigs } = state.staticData;
  return { mainRouter, membership, membershipActivation, remoteConfigs, rootRouter, userData };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateMainTab: tabName => dispatch(navigations.navigateMainTab(tabName)),
    redeemMembership: code => dispatch(serviceApi.redeemMembership(code)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
