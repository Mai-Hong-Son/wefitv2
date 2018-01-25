/**
 * @providesModule WeFit.Components.StudioDetail.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { userData } = state.auth;
  const {
    fitnessTypeIndices, fitnessTypes, studioByBrandIndices, studiosByCity,
  } = state.staticData;
  return { fitnessTypeIndices, fitnessTypes, studioByBrandIndices, studiosByCity, userData };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps)(WrappedComponent);
}
