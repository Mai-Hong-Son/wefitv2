/**
 * @providesModule WeFit.Components.PurchaseReceipt.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { paymentOrderRequest } = state.serviceApi;
  return { paymentOrderRequest };
}

function mapDispatchToProps(dispatch) {
  return {
    requestPaymentOrder: payload => dispatch(serviceApi.requestPaymentOrder(payload)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
