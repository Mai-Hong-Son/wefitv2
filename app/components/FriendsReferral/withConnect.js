/**
 * @providesModule WeFit.Components.FriendsReferral.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { userReferrals } = state.serviceApi;
  return { userReferrals };
}

function mapDispatchToProps(dispatch) {
  return {
    getUserReferrals: () => dispatch(serviceApi.getUserReferrals()),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
