/**
 * @providesModule WeFit.Components.PaymentGateway.withConnect
 */

import { connect } from 'react-redux';
import { auth, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { mainRouter: router } = state;
  return { router };
}

function mapDispatchToProps(dispatch) {
  return {
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
    updateMembership: membership => dispatch(auth.updateMembership(membership)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
