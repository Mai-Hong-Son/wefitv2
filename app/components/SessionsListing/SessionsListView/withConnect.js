/**
 * @providesModule WeFit.Components.SessionsListing.SessionsListView.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { settings } = state.auth;
  const { filters, lastSchedulesReloaded } = state.shared;
  const { fitnessTypeIndices, fitnessTypes, studioIndices, studiosByCity } = state.staticData;

  return {
    filters, fitnessTypeIndices, fitnessTypes, lastSchedulesReloaded,
    studioIndices, studiosByCity, settings,
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps)(WrappedComponent);
}
