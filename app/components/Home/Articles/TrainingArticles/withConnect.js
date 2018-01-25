/**
 * @providesModule WeFit.Components.Home.Articles.TrainingArticles.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { fullSizeArticle, articleFilter } = state.serviceApi;
  const { language, articleFiltered } = state.shared;
  
  return {
    fullSizeArticle, language, articleFiltered, articleFilter,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getArticles: (type, page, id, termFilter) => dispatch(serviceApi.getArticles(type, page, id, termFilter)),
    applyArticleFilters: filters => dispatch(shared.applyArticleFilters(filters)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
