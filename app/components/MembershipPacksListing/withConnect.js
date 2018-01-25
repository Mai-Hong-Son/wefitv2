/**
 * @providesModule WeFit.Components.MembershipPacksListing.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { membershipPacks } = state.serviceApi;
  const { remoteConfigs } = state.staticData;
  return { membershipPacks, remoteConfigs };
}

function mapDispatchToProps(dispatch) {
  return {
    getMembershipPacks: () => dispatch(serviceApi.getMembershipPacks()),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
