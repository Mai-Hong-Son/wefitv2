/**
 * @providesModule WeFit.Components.EmailAuth.SignUp.withConnect
 */

import { connect } from 'react-redux';
import { auth, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { emailAuth, facebookOauth, socialAuth } = state.auth;
  return { emailAuth, facebookOauth, socialAuth };
}

function mapDispatchToProps(dispatch) {
  return {
    signUpWithEmail: credentials => dispatch(auth.signUpWithEmail(credentials)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
