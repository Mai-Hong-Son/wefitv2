/**
 * @providesModule WeFit.Components.Home.HeaderBox.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  // const { language } = state.shared;
  const { mainRouter: router } = state;
  return { /* language, */ router };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps)(WrappedComponent);
}
