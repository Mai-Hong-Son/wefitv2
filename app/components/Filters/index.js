/**
 * @providesModule WeFit.Components.Filters
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import { Extensions } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import CollapsibleScrollView, { FooterBox } from 'app/components/Reusables/CollapsibleScrollView';
import Props from 'app/components/Reusables/Props';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Models
import { Amenity, District, FitnessType } from 'app/models/BaseStaticData';
import TimeRange from 'app/models/TimeRange';
import User from 'app/models/User';

// Locals
import FilterContent from './FilterContent';
import TimeFilterContent from './TimeFilterContent';
import withConnect from './withConnect';

const SECTION_KEY_TIME_RANGES = 'timeRanges';
const SECTION_KEY_DISTRICTS = 'districts';
const SECTION_KEY_FITNESS_TYPES = 'fitnessTypes';
const SECTION_KEY_AMENITIES = 'amenities';

@withConnect
export default class Filters extends React.PureComponent {
  static navigationOptions = () => ({
    gesturesEnabled: false,
    title: I18n.t('filters.title'),
  });

  static propTypes = {
    amenities: PropTypes.arrayOf(PropTypes.instanceOf(Amenity)).isRequired,
    applyFilters: PropTypes.func.isRequired,
    districts: PropTypes.arrayOf(PropTypes.instanceOf(District)).isRequired,
    filters: Props.filters.isRequired,
    fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    userData: PropTypes.instanceOf(User).isRequired,
  };

  constructor(props) {
    super(props);
    
    this.applyFilters = this.props.applyFilters.bind(this);
    this.state = { scrollEnabled: true };
  }
  
  get filterValues() {
    return {
      amenities: this.amenityOptions.selectedOptions,
      districts: this.districtOptions.selectedOptions,
      fitnessTypes: this.fitnessTypeOptions.selectedOptions,
      timeRanges: this.timeFilter.selectedRanges,
    };
  }

  get sectionTitles() {
    const { amenities, fitnessTypes, places, time } = I18n.t('filters.sections');
    return [time, places, fitnessTypes, amenities];
  }

  onApplyFilters = async () => {
    const { navigation: { goBack } } = this.props;
    goBack();
    await Extensions.nap(150);
    this.applyFilters(this.filterValues);
  };

  onClearFilters = () => {
    this.amenityOptions.clear();
    this.districtOptions.clear();
    this.fitnessTypeOptions.clear();
    this.timeFilter.clear();
    this.filterScroll.clear();
  };

  renderAmenities = () => {
    const { amenities, filters: { amenities: presetAmenities } } = this.props;
    
    const data = _.filter(amenities, { filterable: true });
    const presetData = _.filter(presetAmenities, { filterable: true });

    return (
      <FilterContent
        data={_.sortBy(data, 'name')}
        presetData={presetData}
        ref={ref => this.amenityOptions = ref}
        sectionKey={SECTION_KEY_AMENITIES}
      />
    );
  };

  renderDistricts = () => {
    const {
      districts,
      filters: { districts: presetDistricts },
      userData: { city_code: cityCode },
    } = this.props;

    const data = _.filter(districts, { city_code: cityCode });
    const presetData = _.filter(presetDistricts, { city_code: cityCode });

    return (
      <FilterContent
        data={_.sortBy(data, 'name')}
        presetData={presetData}
        ref={ref => this.districtOptions = ref}
        sectionKey={SECTION_KEY_DISTRICTS}
      />
    );
  };

  renderFitnessTypes = () => {
    const { fitnessTypes, filters: { fitnessTypes: presetFitnessTypes } } = this.props;

    return (
      <FilterContent
        data={_.sortBy(fitnessTypes, 'code')}
        presetData={presetFitnessTypes}
        ref={ref => this.fitnessTypeOptions = ref}
        sectionKey={SECTION_KEY_FITNESS_TYPES}
      />
    );
  };

  renderTimeRanges = () => {
    const timeRanges = TimeRange.defaultRanges;
    const { filters: { timeRanges: presetTimeRanges } } = this.props;

    return (
      <TimeFilterContent
        data={timeRanges}
        onTracksSlide={sliding => this.setState({ scrollEnabled: !sliding })}
        presetData={presetTimeRanges}
        ref={ref => this.timeFilter = ref}
        sectionKey={SECTION_KEY_TIME_RANGES}
      />
    );
  };

  render() {
    const { scrollEnabled } = this.state;
    const { apply, clear } = I18n.t('filters.buttons');

    return (
      <View style={styles.container}>
        <CollapsibleScrollView
          ref={ref => this.filterScroll = ref}
          scrollEnabled={scrollEnabled}
          sectionTitles={this.sectionTitles}
        >
          {this.renderTimeRanges()}
          {this.renderDistricts()}
          {this.renderFitnessTypes()}
          {this.renderAmenities()}
        </CollapsibleScrollView>
        <FooterBox
          clearTitle={clear}
          onClear={this.onClearFilters}
          onSubmit={this.onApplyFilters}
          submitTitle={apply}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WEFIT,
  },
});
