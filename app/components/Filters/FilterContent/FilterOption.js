/**
 * @providesModule WeFit.Components.FilterContent.FilterOption
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function FilterOption({ index, onSelect, selected, title }) {
  return (
    <Button containerStyle={styles.container} onPress={() => onSelect(index)}>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]} />
      <Text numberOfLines={1} style={styles.title}>{title}</Text>
    </Button>
  );
}

FilterOption.propTypes = {
  index: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

FilterOption.defaultProps = {
  selected: false,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 1,
    height: 20,
    marginRight: 10,
    width: 20,
  },
  checkboxSelected: {
    backgroundColor: COLORS.PINK,
    borderWidth: 0,
  },
  title: FontUtils.build({
    color: 'white',
    size: 14,
  }),
});
