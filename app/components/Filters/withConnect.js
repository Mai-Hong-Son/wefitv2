/**
 * @providesModule WeFit.Components.Filters.withConnect
 */

import { connect } from 'react-redux';
import { shared } from 'redux/actions';

function mapStateToProps(state) {
  const { userData } = state.auth;
  const { filters } = state.shared;
  const { amenities, districts, fitnessTypes } = state.staticData;
  return { amenities, districts, filters, fitnessTypes, userData };
}

function mapDispatchToProps(dispatch) {
  return {
    applyFilters: newFilters => dispatch(shared.applyFilters(newFilters)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
