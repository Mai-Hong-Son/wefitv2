/**
 * @providesModule WeFit.Components.IntroScreen.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { trialStart } = state.serviceApi;
  return { trialStart };
}

function mapDispatchToProps(dispatch) {
  return {
    startTrial: () => dispatch(serviceApi.startTrial()),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
