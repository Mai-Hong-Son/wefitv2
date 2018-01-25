/**
 * @providesModule WeFit.Controllers.UserDataController.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi, shared } from 'redux/actions';

function mapStateToProps(state) {
  const { userData } = state.auth;
  const { rehydrated } = state.meta;
  const { language } = state.shared;
  return { language, rehydrated, userData };
}

function mapDispatchToProps(dispatch) {
  return {
    changeLanguage: languageCode => dispatch(shared.changeLanguage(languageCode)),
    getUserData: () => dispatch(serviceApi.getUserData()),
    requestUserLocation: requestHandler => dispatch(shared.requestUserLocation(requestHandler)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
