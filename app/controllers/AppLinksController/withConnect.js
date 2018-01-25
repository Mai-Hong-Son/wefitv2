/**
 * @providesModule WeFit.Controllers.AppLinksController.withConnect
 */

import { connect } from 'react-redux';
import { navigations } from 'redux/actions';

function mapStateToProps(state) {
  const { userData } = state.auth;
  const { rehydrated } = state.meta;
  return { rehydrated, userData };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    navigateStudio: configs => dispatch(navigations.navigateStudio(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
