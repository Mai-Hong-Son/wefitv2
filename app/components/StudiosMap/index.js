/**
 * @providesModule WeFit.Components.StudiosMap
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import MapView from 'react-native-maps';
import _ from 'lodash';

// Components
import { LoadingButton, LoadingOverlay } from 'app/components/Reusables/Loadings';

// Constants
import { APP_CONFIGS } from 'app/constants/AppConstants';
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES, ROOT_ROUTES } from 'app/constants/RouteNames';

// Models
import { FitnessType } from 'app/models/BaseStaticData';
import Location from 'app/models/Location';
import Studio from 'app/models/Studio';
import User from 'app/models/User';

// Utils
import { requestLocation } from 'app/utils';

// Locals
import StudioMarker from './StudioMarker';
import withConnect from './withConnect';

const STUDIOS_MAP_INDEX = 2;

@withConnect
export default class StudiosMap extends React.PureComponent {
  static propTypes = {
    dateId: PropTypes.string.isRequired,
    fitnessTypeIndices: PropTypes.objectOf(PropTypes.number).isRequired,
    fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
    getStudiosMap: PropTypes.func.isRequired,
    lastSchedulesReloaded: PropTypes.number.isRequired,
    mainRouter: PropTypes.shape({
      routes: PropTypes.arrayOf(PropTypes.shape({
        index: PropTypes.number,
        routes: PropTypes.arrayOf(PropTypes.object),
      }).isRequired).isRequired,
    }).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    requestUserLocation: PropTypes.func.isRequired,
    studiosByCity: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(Studio))).isRequired,
    studiosMap: PropTypes.objectOf(PropTypes.shape({
      data: PropTypes.objectOf(PropTypes.number),
      error: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    })).isRequired,
    tabId: PropTypes.number.isRequired,
    userData: PropTypes.instanceOf(User).isRequired,
    userLocation: PropTypes.shape({
      data: PropTypes.instanceOf(Location),
      error: PropTypes.any,
      loading: PropTypes.bool,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.getStudiosMap = this.props.getStudiosMap.bind(this);
    this.requestUserLocation = this.props.requestUserLocation.bind(this);

    this.mapRegion = this.buildMapRegion();
    this.state = { markersData: [], selectedStudioId: 0, showMarkers: false };
  }

  componentWillReceiveProps(nextProps) {
    const { lastSchedulesReloaded } = this.props;
    const { lastSchedulesReloaded: nextSchedulesReloaded } = nextProps;
    
    if (lastSchedulesReloaded !== nextSchedulesReloaded && this.checkCurrentTabActive(nextProps))
      this.requestStudioMap();

    if (!this.checkCurrentTabActive(this.props) && this.checkCurrentTabActive(nextProps))
      this.requestStudioMap();
  }
  
  componentDidUpdate(prevProps) {
    const { tabId, studiosMap: { [tabId]: { data: mapData } }, userLocation } = this.props;
    const {
      studiosMap: { [tabId]: { data: nextMapData } },
      userLocation: prevUserLocation,
    } = prevProps;

    if (mapData !== nextMapData)
      this.buildMarkersData();

    if (userLocation !== prevUserLocation) {
      const { data, loading } = userLocation;
      if (!loading && data != null && this.mapView != null)
        this.mapView.animateToRegion(this.buildMapRegion());
    }
  }

  checkCurrentTabActive = props => {
    const { mainRouter: { routes: mainRoutes }, tabId } = props || this.props;
    const { index: mainIndex, routes: tabNavRoutes } = _.find(mainRoutes, { routeName: ROOT_ROUTES.MAIN }) || {};
    if (mainIndex !== STUDIOS_MAP_INDEX) return false;

    const { routes: tabRoutes } = tabNavRoutes[mainIndex];
    const { index } = tabRoutes[0];
    return tabId === index;
  }

  buildMapRegion() {
    const { userData: { city_code: cityCode }, userLocation: { data } } = this.props;
    const location = data || Location.defaultLocation(cityCode);
    return { ...location, ...APP_CONFIGS.MAP_SCALE };
  }

  buildMarkersData() {
    const {
      fitnessTypeIndices: indices,
      fitnessTypes: types,
      studiosByCity,
      tabId,
      studiosMap: { [tabId]: { data } },
      userData: { city_code: cityCode },
    } = this.props;
    const { selectedStudioId } = this.state;
    const { latitude, latitudeDelta, longitude, longitudeDelta } = this.mapRegion;
    const {
      latitudeDelta: defaultLatDelta,
      longitudeDelta: defaultLngDelta,
    } = APP_CONFIGS.MAP_SCALE;

    const latDelta = latitudeDelta <= 0.5 ? latitudeDelta : defaultLatDelta;
    const lngDelta = longitudeDelta <= 0.5 ? longitudeDelta : defaultLngDelta;
    
    const { [cityCode]: studios } = studiosByCity;
    const enabledStudios = _.filter(studios, studio => {
      const { is_enabled: enabled, location } = studio;

      return enabled &&
            location.latitude >= latitude - latDelta &&
            location.latitude <= latitude + latDelta &&
            location.longitude >= longitude - lngDelta &&
            location.longitude <= longitude + lngDelta;
    });
    
    const markersData = _.map(enabledStudios, studio => {
      const { id, fitness_type_codes: codes } = studio;
      const { [id]: sessionsCount } = data || {};
      
      return {
        selectedStudioId,
        studio,
        available: sessionsCount > 0,
        fitnessTypes: FitnessType.filterByCodes(types, indices, codes),
        key: `studio_marker_${id}`,
      };
    });

    this.setState({ markersData, showMarkers: true });
  }

  requestStudioMap = () => {
    const { dateId, tabId } = this.props;
    this.getStudiosMap({ dateId, tabId });
  };

  checkStudioAvailable = studioId => {
    const { tabId, studiosMap: { [tabId]: { data } } } = this.props;
    const { [studioId]: sessionsCount } = data;
    return sessionsCount > 0;
  };

  onRegionChangeComplete = region => {
    this.mapRegion = region;
    this.buildMarkersData();
  };

  onSearchStudios = () => {
    const { navigation: { navigate } } = this.props;
    navigate(MAIN_ROUTES.SEARCH_STUDIOS);
  };

  onSelectMarker = studio => this.setState({ selectedStudioId: studio.id });

  onNavigateStudio = studio => {
    const { navigation: { navigate } } = this.props;
    navigate(MAIN_ROUTES.STUDIO_DETAIL, { studio });
  };

  renderMarkers = () => {
    const { markersData, showMarkers } = this.state;
    if (!showMarkers) return null;
    
    return _.map(markersData, props => (
      <StudioMarker
        onNavigateStudio={this.onNavigateStudio}
        onSelectMarker={this.onSelectMarker}
        {...props}
      />
    ));
  }

  render() {
    if (!this.checkCurrentTabActive()) return null;

    const {
      tabId,
      studiosMap: { [tabId]: { loading: requestingStudiosMap } },
      userLocation: { loading: requestingLocation },
    } = this.props;

    return (
      <View style={styles.container}>
        <MapView
          onRegionChangeComplete={this.onRegionChangeComplete}
          ref={ref => this.mapView = ref}
          region={this.mapRegion}
          showsMyLocationButton={false}
          showsUserLocation
          style={styles.mapView}
        >
          {this.renderMarkers()}
        </MapView>
        <Button containerStyle={styles.searchButton} onPress={this.onSearchStudios}>
          <Image source={require('app/assets/buttons/search.png')} />
        </Button>
        <LoadingButton
          containerStyle={styles.myLocationButton}
          loading={requestingLocation}
          loadingProps={{ color: COLORS.WEFIT, size: 60, type: 'Pulse' }}
          onPress={() => this.requestUserLocation(requestLocation)}
        >
          <Image source={require('app/assets/buttons/my-location.png')} />
        </LoadingButton>
        <LoadingOverlay visible={requestingStudiosMap} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },

  mapView: Platform.select({
    ios: {
      flex: 1,
    },
    android: {
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
  }),

  myLocationButton: {
    bottom: 16,
    position: 'absolute',
    right: 16,
  },
  searchButton: {
    bottom: 86,
    position: 'absolute',
    right: 16,
  },
});
