/**
 * @providesModule WeFit.Components.Reusables.OptionsBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import _ from 'lodash';

// Locals
import OptionItem from './OptionItem';

export default class OptionsBox extends React.PureComponent {
  static propTypes = {
    multiple: PropTypes.bool,
    onSelectMultipleOptions: PropTypes.func,
    onSelectOption: PropTypes.func,
    optionTexts: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    multiple: false,
    onSelectMultipleOptions: null,
    onSelectOption: null,
    optionTexts: [],
  };

  state = { selectedIndex: -1, selectedIndices: [] };

  get selectedIndex() {
    return this.state.selectedIndex;
  }
  
  get selectedIndices() {
    return this.state.selectedIndices;
  }

  clear = () => this.onSelectIndex(-1);

  selectOptions = ({ index, indices }) => {
    if (typeof(index) === 'number' && index > 0) {
      this.setState({ selectedIndex: index });
      return;
    }

    if (!_.isEmpty(indices))
      this.setState({ selectedIndices: indices });
  };

  onSelectIndex = index => {
    const { multiple } = this.props;

    if (!multiple) {
      this.setState({ selectedIndex: index });
      const { onSelectOption } = this.props;
      onSelectOption && onSelectOption(index);
      return;
    }

    const { selectedIndices } = this.state;
    // index === -1 means clear
    const newIndices = index === -1 ? [] : _.sortBy(_.xor(selectedIndices, [index]));
    this.setState({ selectedIndices: newIndices });

    const { onSelectMultipleOptions } = this.props;
    onSelectMultipleOptions && onSelectMultipleOptions(newIndices);
  };

  render() {
    const { multiple, optionTexts } = this.props;
    if (_.isEmpty(optionTexts)) return null;

    const { selectedIndex, selectedIndices } = this.state;

    return (
      <View style={styles.container}>
        {_.map(optionTexts, (option, index) => (
          <OptionItem
            checkbox={multiple}
            key={`option_item_${index}`}
            onSelect={() => this.onSelectIndex(index)}
            selected={multiple ? _.includes(selectedIndices, index) : selectedIndex === index}
            title={option}
          />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingBottom: 6,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
