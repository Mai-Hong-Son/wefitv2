/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.withConnect
 */

import { connect } from 'react-redux';
import { shared } from 'redux/actions';

function mapStateToProps(state) {
  const { mainRouter, rootRouter } = state;
  const { membership, userData } = state.auth;
  return { mainRouter, membership, rootRouter, userData };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
