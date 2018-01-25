/**
 * @providesModule WeFit.Components.SessionDetail.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { receivedNotification } = state.firebase;
  const { amenities, fitnessTypeIndices, fitnessTypes } = state.staticData;
  return { amenities, fitnessTypeIndices, fitnessTypes, receivedNotification };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps)(WrappedComponent);
}
