/**
 * @providesModule WeFit.Components.Home.AnnouncementArticlesList.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { announcements } = state.serviceApi;
  const { language } = state.shared;
  return {
    announcements, language,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getArticles: (type, page) => dispatch(serviceApi.getArticles(type, page)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
