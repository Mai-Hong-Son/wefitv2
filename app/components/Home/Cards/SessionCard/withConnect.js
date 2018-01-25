/**
 * @providesModule WeFit.Components.Home.Cards.SessionCard.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { studioIndices, studiosByCity } = state.staticData;
  return { studioIndices, studiosByCity };
}

function mapDispatchToProps(dispatch) {
  return {
    cancelReview: reviewId => dispatch(serviceApi.cancelReview(reviewId)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
