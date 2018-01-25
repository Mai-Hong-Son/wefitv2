/**
 * @providesModule WeFit.Components.MembershipPacksListing.PromoCodePopup.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { promoCodeChecking } = state.serviceApi;
  return { promoCodeChecking };
}

function mapDispatchToProps(dispatch) {
  return {
    checkPromoCode: code => dispatch(serviceApi.checkPromoCode(code)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
