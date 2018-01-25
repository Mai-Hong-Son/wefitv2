/**
 * @providesModule WeFit.Components.FriendsReferral.ReferralCodePopup.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { referralCodeLinking } = state.serviceApi;
  return { referralCodeLinking };
}

function mapDispatchToProps(dispatch) {
  return {
    linkReferralCode: code => dispatch(serviceApi.linkReferralCode(code)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
