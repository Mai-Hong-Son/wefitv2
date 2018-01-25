/**
 * @providesModule WeFit.Components.Home.Articles.FilterArticles.withConnect
 */

import { connect } from 'react-redux';
import { shared } from 'redux/actions';

function mapStateToProps(state) {
  const { articleFilter } = state.serviceApi;
  const { language, articleFiltered } = state.shared;
  return {
    articleFilter, language, articleFiltered,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applyArticleFilters: filters => dispatch(shared.applyArticleFilters(filters)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
