/**
 * @providesModule WeFit.Components.HeaderRightButtons.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { mainRouter: router } = state;
  const { studioDetail, studioFavorUpdate } = state.serviceApi;
  const { studioFavorStatuses } = state.shared;
  return { router, studioDetail, studioFavorStatuses, studioFavorUpdate };
}

function mapDispatchToProps(dispatch) {
  return {
    favorStudio: configs => dispatch(serviceApi.favorStudio(configs)),
    getStudioDetail: studioId => dispatch(serviceApi.getStudioDetail(studioId)),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
    updateStudioFavorStatus: configs => dispatch(shared.updateStudioFavorStatus(configs)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
