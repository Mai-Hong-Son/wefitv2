/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.MainStack.FiltersHeader.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { filters } = state.shared;
  return { filters };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps)(WrappedComponent);
}
