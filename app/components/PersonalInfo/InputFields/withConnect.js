/**
 * @providesModule WeFit.Components.PersonalInfo.InputFields.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { userData } = state.auth;
  const { cities, studiosByCity } = state.staticData;
  return { cities, studiosByCity, userData };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps)(WrappedComponent);
}
