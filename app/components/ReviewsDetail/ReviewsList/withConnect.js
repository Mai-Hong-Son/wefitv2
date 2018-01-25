/**
 * @providesModule WeFit.Components.ReviewsDetail.ReviewsList.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { detailReviews } = state.serviceApi;
  return { detailReviews };
}

function mapDispatchToProps(dispatch) {
  return {
    getDetailReviews: payload => dispatch(serviceApi.getDetailReviews(payload)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
