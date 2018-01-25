/**
 * @providesModule WeFit.Components.AppNavigator.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { appRouter } = state;
  const { rehydrated } = state.meta;
  return { appRouter, rehydrated };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
