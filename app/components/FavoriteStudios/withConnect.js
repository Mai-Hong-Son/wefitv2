/**
 * @providesModule WeFit.Components.FavoriteStudios.withConnect
 */

import { connect } from 'react-redux';
import { serviceApi } from 'redux/actions';

function mapStateToProps(state) {
  const { userData } = state.auth;
  const { favoriteStudios } = state.serviceApi;
  const { lastFavoriteStudiosReloaded } = state.shared;
  const { studioIndices, studiosByCity } = state.staticData;
  return { lastFavoriteStudiosReloaded, favoriteStudios, studioIndices, studiosByCity, userData };
}

function mapDispatchToProps(dispatch) {
  return {
    getFavoriteStudios: () => dispatch(serviceApi.getFavoriteStudios()),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
