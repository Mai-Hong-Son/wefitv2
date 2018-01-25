/**
 * @providesModule WeFit.Components.Welcome.withConnect
 */

import { connect } from 'react-redux';
import { shared } from 'redux/actions';

function mapStateToProps(state) {
  const { language } = state.shared;
  return { language };
}

function mapDispatchToProps(dispatch) {
  return {
    changeLanguage: languageCode => dispatch(shared.changeLanguage(languageCode)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
