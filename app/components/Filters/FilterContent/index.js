/**
 * @providesModule WeFit.Components.FilterContent
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import _ from 'lodash';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

// Models
import { Amenity, District, FitnessType } from 'app/models/BaseStaticData';
import TimeRange from 'app/models/TimeRange';

// Locals
import FilterOption from './FilterOption';

export default class FilterContent extends React.PureComponent {
  static propTypes = {
    children: PropTypes.element,
    data: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.instanceOf(Amenity),
      PropTypes.instanceOf(District),
      PropTypes.instanceOf(FitnessType),
      PropTypes.instanceOf(TimeRange),
    ])).isRequired,
    onOptionsChange: PropTypes.func,
    presetData: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.instanceOf(Amenity),
      PropTypes.instanceOf(District),
      PropTypes.instanceOf(FitnessType),
      PropTypes.instanceOf(TimeRange),
    ])).isRequired,
    sectionKey: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: null,
    onOptionsChange: null,
  };

  constructor(props) {
    super(props);
    
    const { onOptionsChange } = this.props;
    this.onOptionsChange = onOptionsChange == null ? null : onOptionsChange.bind(this);

    this.state = { selectedOptions: this.buildPresetOptions() };
  }

  componentDidUpdate() {
    if (this.onOptionsChange != null)
      this.onOptionsChange(this.selectedOptions);
  }

  get selectedOptions() {
    const { data } = this.props;
    const { selectedOptions } = this.state;
    return _.filter(data, (element, index) => selectedOptions[index]);
  }

  buildPresetOptions = () => {
    const { data, presetData } = this.props;
    const dataIds = _.map(data, 'id');
    const presetIds = _.map(presetData, 'id');
    const indicies = _.range(data.length);
    const selectedValues = _.map(dataIds, id => _.includes(presetIds, id));
    return _.zipObject(indicies, selectedValues);
  };

  clear = () => this.setState({ selectedOptions: {} });

  onSelectOption = index => {
    const { selectedOptions } = this.state;
    const { [index]: selected } = selectedOptions;
    this.setState({ selectedOptions: { ...selectedOptions, [index]: !selected } });
  };

  renderColumn = (from, to) => {
    const { data, sectionKey } = this.props;
    const { selectedOptions } = this.state;
    const columnData = _.slice(data, from, to);
    return (
      <View style={styles.contentColumn}>
        {_.map(columnData, ({ name }, index) => (
          <FilterOption
            index={index + from}
            key={`filter_option_${sectionKey}_${index + from}`}
            onSelect={this.onSelectOption}
            selected={selectedOptions[index + from] === true}
            title={name}
          />
        ))}
      </View>
    );
  };

  render() {
    const { children, data } = this.props;
    if (_.isEmpty(data)) return null;

    const middleIndex = Math.ceil(data.length / 2);

    return (
      <View>
        <View style={styles.container}>
          {this.renderColumn(0, middleIndex)}
          {this.renderColumn(middleIndex, data.length)}
        </View>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    alignItems: 'flex-start',
    margin: 16,
    marginBottom: 0, // FilterOptions already margin bottom 10px
  },
  contentColumn: {
    flex: 1,
    overflow: 'hidden',
  },
});
