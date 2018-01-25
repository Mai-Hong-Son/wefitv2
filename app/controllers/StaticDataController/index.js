/**
 * @providesModule WeFit.Controllers.StaticDataController
 */

/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import PropTypes from 'prop-types';
import { Extensions, Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { APP_CONFIGS } from 'app/constants/AppConstants';
import { FEATURES } from 'app/constants/Flags';

// Models
import { Amenity, City, District, FitnessType } from 'app/models/BaseStaticData';
import Country from 'app/models/Country';
import Studio from 'app/models/Studio';

// Locals
import BaseController from '../BaseController';
import withConnect from './withConnect';

const DEFAULT_DATA_KEYS = [
  'amenities', 'cities', 'countries', 'districts', 'fitnessTypes', 'remoteConfigs',
];
const TIME_TO_RETRY = 1000; // (retryTimeMult * 1000) ms before retries

@withConnect
export default class StaticDataController extends BaseController {
  /* eslint-disable react/sort-prop-types */
  static propTypes = {
    beginFetching: PropTypes.func.isRequired,
    endFetching: PropTypes.func.isRequired,
    getAmenities: PropTypes.func.isRequired,
    getCities: PropTypes.func.isRequired,
    getCountries: PropTypes.func.isRequired,
    getDistricts: PropTypes.func.isRequired,
    getFitnessTypes: PropTypes.func.isRequired,
    getRemoteConfigs: PropTypes.func.isRequired,
    getStudiosByCity: PropTypes.func.isRequired,
    loadLocalData: PropTypes.func.isRequired,

    // Static data
    amenities: PropTypes.arrayOf(PropTypes.instanceOf(Amenity)).isRequired,
    cities: PropTypes.arrayOf(PropTypes.instanceOf(City)).isRequired,
    countries: PropTypes.arrayOf(PropTypes.instanceOf(Country)).isRequired,
    districts: PropTypes.arrayOf(PropTypes.instanceOf(District)).isRequired,
    fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
    studiosByCity: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(Studio))).isRequired,

    // Others
    lastFetchedAt: PropTypes.number.isRequired,
    loadingProgress: PropTypes.number.isRequired,
    rehydrated: PropTypes.bool.isRequired,
    retryKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  };
  /* eslint-enable react/sort-prop-types */

  static defaultProps = {
    retryKeys: null,
  };

  constructor(props) {
    super(props);
    
    this.beginFetching = this.props.beginFetching.bind(this);
    this.endFetching = this.props.endFetching.bind(this);
    this.getAmenities = this.props.getAmenities.bind(this);
    this.getCities = this.props.getCities.bind(this);
    this.getCountries = this.props.getCountries.bind(this);
    this.getDistricts = this.props.getDistricts.bind(this);
    this.getFitnessTypes = this.props.getFitnessTypes.bind(this);
    this.getRemoteConfigs = this.props.getRemoteConfigs.bind(this);
    this.getStudiosByCity = this.props.getStudiosByCity.bind(this);
    this.loadLocalData = this.props.loadLocalData.bind(this);

    this.retryTimeMult = 1;
    
    if (FEATURES.GLOBAL_MODULES) global.StaticDataController = this;
  }

  componentWillReceiveProps(nextProps) {
    const {
      cities, fitnessTypes, lastFetchedAt, loadingProgress, rehydrated, studiosByCity,
    } = this.props;
    const {
      cities: nextCities,
      fitnessTypes: nextFitnessTypes,
      lastFetchedAt: nextFetchedAt,
      loadingProgress: nextLoadingProgress,
      rehydrated: nextRehydrated,
      retryKeys,
      studiosByCity: nextStudiosByCity,
    } = nextProps;
    
    if ((!rehydrated && nextRehydrated) ||
        (rehydrated && lastFetchedAt > 0 && nextFetchedAt <= 0)) // Clearing cache
      this.checkAndFetchData(nextFetchedAt);

    // Fetch cities data if cities changed and rehydrated
    if (cities !== nextCities && rehydrated)
      _.each(nextCities, ({ code }) => this.getStudiosByCity(code));

    if (fitnessTypes !== nextFitnessTypes) {
      const fitnessTypeIndices = FitnessType.buildIndices(nextFitnessTypes);
      this.loadLocalData({ fitnessTypeIndices });
    }

    if (studiosByCity !== nextStudiosByCity) {
      const { studioByBrandIndices, studioIndices } = Studio.buildIndices(nextStudiosByCity);
      this.loadLocalData({ studioByBrandIndices, studioIndices });
    }

    if (loadingProgress !== nextLoadingProgress && nextLoadingProgress >= 1)
      this.handleRetry(retryKeys);
  }

  fetchRemoteData = (dataKeys = DEFAULT_DATA_KEYS) => {
    // Signal to reset progress
    this.beginFetching();

    _.each(dataKeys, key => {
      switch (key) {
        case 'amenities': this.getAmenities(); return;
        case 'cities': this.getCities(); return;
        case 'countries': this.getCountries(); return;
        case 'districts': this.getDistricts(); return;
        case 'fitnessTypes': this.getFitnessTypes(); return;
        case 'remoteConfigs': this.getRemoteConfigs(); return;
        default: {
          if (_.startsWith(key, 'studiosByCity')) this.getCities();
          return;
        }
      }
    });
  };

  checkAndFetchData = lastFetchedAt => {
    const { STATIC_DATA_EXPIRED_AFTER } = APP_CONFIGS;
    const now = Date.now();

    if (lastFetchedAt > now - STATIC_DATA_EXPIRED_AFTER) {
      const nextFetchedAt = lastFetchedAt - now + STATIC_DATA_EXPIRED_AFTER + 100; // extra 100ms
      Logger.log(`Static data not expired, will be fetched after ${nextFetchedAt / 1000}s!`);
      setTimeout(() => this.fetchRemoteData(lastFetchedAt), nextFetchedAt);
      return;
    }

    Logger.log('Static data expired, refreshing...');
    this.fetchRemoteData();
    
    // Schedule to re-fetch all data
    setTimeout(() => this.fetchRemoteData(now), STATIC_DATA_EXPIRED_AFTER + 100);
  };

  handleRetry = async dataKeys => {
    await Extensions.nap(500);
    this.endFetching();
    if (_.isEmpty(dataKeys)) return;
    
    this.retryTimeMult *= 1.5;
    const delay = this.retryTimeMult * TIME_TO_RETRY;
    await Extensions.nap(delay);
    Logger.log(`There're errors when fetching keys: ${dataKeys.join(', ')}, \
retrying after ${delay}ms...`);

    this.fetchRemoteData(dataKeys);
  };
}
