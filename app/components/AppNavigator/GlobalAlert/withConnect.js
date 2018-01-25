/**
 * @providesModule WeFit.Components.AppNavigator.GlobalAlert.withConnect
 */

import { connect } from 'react-redux';
import { navigations, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { appRouter } = state;
  const { rehydrated } = state.meta;
  const { globalAlert, language } = state.shared;
  return { appRouter, globalAlert, language, rehydrated };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    clearFilters: () => dispatch(shared.clearFilters()),
    clearGlobalAlert: () => dispatch(shared.clearGlobalAlert()),
    navigateArticle: article => dispatch(navigations.navigateArticle(article)),    
    navigateMainTab: tabName => dispatch(navigations.navigateMainTab(tabName)),
    navigateSession: configs => dispatch(navigations.navigateSession(configs)),
    navigateStudio: configs => dispatch(navigations.navigateStudio(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
