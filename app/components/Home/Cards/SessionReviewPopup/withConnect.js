/**
 * @providesModule WeFit.Components.Home.Cards.SessionReviewPopup.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { reviewSubmission } = state.serviceApi;
  return { reviewSubmission };
}

function mapDispatchToProps(dispatch) {
  return {
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
    submitReview: configs => dispatch(serviceApi.submitReview(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
