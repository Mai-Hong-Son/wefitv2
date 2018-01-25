/**
 * @providesModule WeFit.Components.InternalWebBrowser.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { articleDetail } = state.serviceApi;
  const { language } = state.shared;
  
  return {
    articleDetail, language,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addFavorite: id => dispatch(serviceApi.addFavorite(id)),
    deleteFavorite: id => dispatch(serviceApi.deleteFavorite(id)),
    getArticleDetail: id => dispatch(serviceApi.getArticleDetail(id)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
