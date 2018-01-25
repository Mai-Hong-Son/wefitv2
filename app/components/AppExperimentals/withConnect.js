/**
 * @providesModule WeFit.Components.AppExperimentals.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  return { ...state };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
