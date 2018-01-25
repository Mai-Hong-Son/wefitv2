/**
 * @providesModule WeFit.Components.SearchStudios.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { studiosByCity } = state.staticData;
  const { userData } = state.auth;
  return { studiosByCity, userData };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps)(WrappedComponent);
}
