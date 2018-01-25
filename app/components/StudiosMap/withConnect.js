/**
 * @providesModule WeFit.Components.SessionsMap.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { mainRouter } = state;
  const { userData } = state.auth;
  const { lastSchedulesReloaded, userLocation } = state.shared;
  const { studiosMap } = state.serviceApi;
  const { fitnessTypeIndices, fitnessTypes, studiosByCity } = state.staticData;
  return {
    fitnessTypeIndices, fitnessTypes, lastSchedulesReloaded, mainRouter,
    studiosByCity, studiosMap, userData, userLocation,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getStudiosMap: ({ dateId, tabId }) => dispatch(serviceApi.getStudiosMap({ dateId, tabId })),
    requestUserLocation: requestHandler => dispatch(shared.requestUserLocation(requestHandler)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
