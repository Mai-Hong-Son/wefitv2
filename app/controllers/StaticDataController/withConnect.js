/**
 * @providesModule WeFit.Controllers.StaticDataController.withConnect
 */

import { connect } from 'react-redux';
import { staticData } from 'redux/actions';

function mapStateToProps(state) {
  const { staticData } = state;
  const { rehydrated } = state.meta;
  return { ...staticData, rehydrated };
}

function mapDispatchToProps(dispatch) {
  return {
    beginFetching: () => dispatch(staticData.beginFetching()),
    endFetching: () => dispatch(staticData.endFetching()),
    getAmenities: () => dispatch(staticData.getAmenities()),
    getCities: () => dispatch(staticData.getCities()),
    getCountries: () => dispatch(staticData.getCountries()),
    getDistricts: () => dispatch(staticData.getDistricts()),
    getFitnessTypes: () => dispatch(staticData.getFitnessTypes()),
    getRemoteConfigs: () => dispatch(staticData.getRemoteConfigs()),
    getStudiosByCity: cityCode => dispatch(staticData.getStudiosByCity(cityCode)),
    loadLocalData: data => dispatch(staticData.loadLocalData(data)),
  };
}

export default function withConnect(WrappedComponent) {
  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
}
