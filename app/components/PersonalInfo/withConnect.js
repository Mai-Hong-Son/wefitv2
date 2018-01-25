/**
 * @providesModule WeFit.Components.PersonalInfo.withConnect
 */

import { connect } from 'react-redux';
import { auth, serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { personalInfo } = state.serviceApi;
  return { personalInfo };
}

function mapDispatchToProps(dispatch) {
  return {
    deauthorize: () => dispatch(auth.deauthorize()),
    showGlobalAlert: configs => dispatch(shared.showGlobalAlert(configs)),
    updatePersonalInfo: infoData => dispatch(serviceApi.updatePersonalInfo(infoData)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
