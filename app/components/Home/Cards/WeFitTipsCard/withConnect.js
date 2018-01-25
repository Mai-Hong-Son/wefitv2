/**
 * @providesModule WeFit.Components.Home.Cards.WeFitTipsCard.withConnect
 */

import { connect } from 'react-redux';

function mapStateToProps(state) {
  const { membership } = state.auth;
  return { membership };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps)(WrappedComponent);
}
