/**
 * @providesModule WeFit.Components.EmailAuth.ResetPassword.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { rootRouter: router } = state;
  const { resetPasswordRequest } = state.serviceApi;
  return { resetPasswordRequest, router };
}

function mapDispatchToProps(dispatch) {
  return {
    resetPassword: credentials => dispatch(serviceApi.resetPassword(credentials)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
