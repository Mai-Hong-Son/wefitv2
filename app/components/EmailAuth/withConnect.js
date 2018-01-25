/**
 * @providesModule WeFit.Components.EmailAuth.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { changePasswordRequest, emailAuth, forgetPasswordRequest } = state.auth;
  return { changePasswordRequest, emailAuth, forgetPasswordRequest };
}

function mapDispatchToProps(dispatch) {
  return {
    forgotPassword: credentials => dispatch(serviceApi.forgotPassword(credentials)),
    resetPassword: credentials => dispatch(serviceApi.resetPassword(credentials)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
