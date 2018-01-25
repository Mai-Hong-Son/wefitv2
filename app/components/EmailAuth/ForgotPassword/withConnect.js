/**
 * @providesModule WeFit.Components.EmailAuth.ForgotPassword.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { forgotPasswordRequest } = state.serviceApi;
  return { forgotPasswordRequest };
}

function mapDispatchToProps(dispatch) {
  return {
    forgotPassword: email => dispatch(serviceApi.forgotPassword(email)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
