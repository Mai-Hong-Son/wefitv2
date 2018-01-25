/**
 * @providesModule WeFit.Components.TimeFilterContent
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import DoubleSlider from 'app/components/Reusables/DoubleSlider';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import TimeRange from 'app/models/TimeRange';

// Locals
import FilterContent from './FilterContent';

export default class TimeFilterContent extends React.PureComponent {
  static propTypes = {
    ...FilterContent.propTypes,
    ...DoubleSlider.propTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      customTimeRange: TimeRange.buildCustomData(),
      sliderDisabled: false,
    };
  }

  componentDidMount() {
    /**
     * @README
     * In this component, we use setTimeout instead of InteractionManager.runAfterInteractions
     * because that method was already used in Filters' index scene.
     * Calling it multiple could lead to some (unknown) conflicts.
     * Setting timeout seems to be a better solution here.
     */
    setTimeout(this.checkAndPresetSlider, 200);
  }

  get selectedRanges() {
    const { customTimeRange, sliderDisabled } = this.state;
    if (sliderDisabled) return this.timeOptions.selectedOptions;
    if (!customTimeRange.atFullRange) return [customTimeRange];
    return [];
  }

  checkAndPresetSlider = () => {
    const { presetData } = this.props;
    const [customTimeRange] = _.filter(presetData, ['is_default', false]);
    if (customTimeRange == null) return;

    const { max_level: to, min_level: from } = customTimeRange;
    this.setState({ customTimeRange }, () => (
      this.timeSlider.slideTracks({ from, to }, { shouldCallback: false })
    ));
  }

  clear = () => {
    this.timeOptions.clear();
    this.timeSlider.clear();
  };

  onValuesChange = ({ max, min }) => this.setState({
    customTimeRange: TimeRange.fromPercentages({ max, min }),
  });

  renderSlider = () => {
    const { onTracksSlide } = this.props;
    const { customTimeRange, sliderDisabled: disabled } = this.state;

    const slideTextStyle = [styles.slideText, disabled && styles.slideTextDisabled];

    return (
      <View style={styles.container}>
        <View style={styles.slideTextsContainer}>
          <Text style={slideTextStyle}>{I18n.t('filters.customTime')}</Text>
          <Text style={slideTextStyle}>{customTimeRange.name}</Text>
        </View>
        <DoubleSlider
          disabled={disabled}
          onTracksSlide={onTracksSlide}
          onValuesChange={this.onValuesChange}
          ref={ref => this.timeSlider = ref}
        />
      </View>
    );
  };

  render() {
    const { data, presetData, sectionKey } = this.props;

    return (
      <FilterContent
        data={data}
        onOptionsChange={options => this.setState({ sliderDisabled: !_.isEmpty(options) })}
        presetData={presetData}
        ref={ref => this.timeOptions = ref}
        sectionKey={sectionKey}
      >
        {this.renderSlider()}
      </FilterContent>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 6,
  },
  slideTextsContainer: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  slideText: FontUtils.build({
    color: 'white',
    size: 14,
  }),
  slideTextDisabled: {
    color: COLORS.ALL_9,
  },
});
