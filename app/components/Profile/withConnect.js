/**
 * @providesModule WeFit.Components.Profile.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { membership, userData } = state.auth;
  return { membership, userData };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps)(WrappedComponent);
}
