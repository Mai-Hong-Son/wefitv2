/**
 * @providesModule WeFit.Components.Home.withConnect
 */

import { connect } from 'react-redux';
import { navigations, serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { userData } = state.auth;
  const { articleFeeds, paymentOrderRequest, userFeeds } = state.serviceApi;
  const { language, lastHomeFeedsReloaded } = state.shared;
  return {
    articleFeeds, language, lastHomeFeedsReloaded, paymentOrderRequest, userData, userFeeds,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cancelPaymentOrder: orderId => dispatch(serviceApi.cancelPaymentOrder(orderId)),
    dismissUserFeed: feedItem => dispatch(serviceApi.dismissUserFeed(feedItem)),
    getArticleFeeds: () => dispatch(serviceApi.getArticleFeeds()),
    getUserFeeds: () => dispatch(serviceApi.getUserFeeds()),
    navigateSession: configs => dispatch(navigations.navigateSession(configs)),
    requestPaymentOrder: info => dispatch(serviceApi.requestPaymentOrder(info)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
