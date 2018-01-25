/**
 * @providesModule WeFit.Components.EmailAuth.Login.withConnect
 */

import { connect } from 'react-redux';
import { auth, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { emailAuth } = state.auth;
  return { emailAuth };
}

function mapDispatchToProps(dispatch) {
  return {
    loginWithEmail: credentials => dispatch(auth.loginWithEmail(credentials)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
