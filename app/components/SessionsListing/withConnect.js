/**
 * @providesModule WeFit.Components.SessionsListing.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { mainRouter } = state;
  const { mySessions, overallSchedules, studioSchedules } = state.serviceApi;
  const { remoteConfigs } = state.staticData;
  return { mainRouter, mySessions, overallSchedules, remoteConfigs, studioSchedules };
}

function mapDispatchToProps(dispatch) {
  return {
    getMySessions: payload => dispatch(serviceApi.getMySessions(payload)),
    getOverallSchedules: payload => dispatch(serviceApi.getOverallSchedules(payload)),
    getStudioSchedules: payload => dispatch(serviceApi.getStudioSchedules(payload)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
