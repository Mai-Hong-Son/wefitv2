/**
 * @providesModule WeFit.Components.Home.ArticleCategoriesContent.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { articleCategories } = state.serviceApi;
  const { language } = state.shared;
  return {
    articleCategories, language,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getArticleCategories: type => dispatch(serviceApi.getArticleCategories(type)),
    getArticlesFilter: id => dispatch(serviceApi.getArticlesFilter(id)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
