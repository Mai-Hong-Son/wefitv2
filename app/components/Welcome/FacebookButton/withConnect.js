/**
 * @providesModule WeFit.Components.Welcome.FacebookButton.withConnect
 */

import { connect } from 'react-redux';
import { auth } from 'redux/actions';

function mapStateToProps(state) {
  const { facebookOauth, socialAuth } = state.auth;
  const { language } = state.shared; // to trigger reloading when language changed
  return { facebookOauth, language, socialAuth };
}

function mapDispatchToProps(dispatch) {
  return {
    connectFacebook: fromScene => dispatch(auth.connectFacebook(fromScene)),
    loginWithSocialAccount: accessToken => dispatch(auth.loginWithSocialAccount(accessToken)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
