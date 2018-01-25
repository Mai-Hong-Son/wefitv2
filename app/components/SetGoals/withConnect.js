/**
 * @providesModule WeFit.Components.SetGoals.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { goals } = state.shared;
  return { goals };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps)(WrappedComponent);
}
