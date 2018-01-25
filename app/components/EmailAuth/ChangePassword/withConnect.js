/**
 * @providesModule WeFit.Components.EmailAuth.ChangePassword.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { changePasswordRequest } = state.serviceApi;
  return { changePasswordRequest };
}

function mapDispatchToProps(dispatch) {
  return {
    changePassword: credentials => dispatch(serviceApi.changePassword(credentials)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
