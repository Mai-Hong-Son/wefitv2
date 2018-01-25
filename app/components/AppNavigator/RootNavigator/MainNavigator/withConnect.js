/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.MainNavigator.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { mainRouter } = state;
  const { userData } = state.auth;
  const { language } = state.shared;
  return { language, mainRouter, userData };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
