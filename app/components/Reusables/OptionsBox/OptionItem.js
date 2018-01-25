/**
 * @providesModule WeFit.Components.Reusables.OptionsBox.OptionItem
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function OptionItem({ checkbox, onSelect, selected, title }) {
  const bulletStyles = [
    styles.radio,
    checkbox && styles.checkbox,
    selected && styles.radioSelected,
  ];

  return (
    <Button containerStyle={styles.container} onPress={onSelect}>
      <View style={bulletStyles} />
      <Text style={styles.title}>{title}</Text>
    </Button>
  );
}

OptionItem.propTypes = {
  checkbox: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

OptionItem.defaultProps = {
  checkbox: false,
  onSelect: null,
  selected: false,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: FontUtils.build({
    color: 'white',
    size: 14,
  }),

  radio: {
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    marginRight: 10,
    width: 20,
  },
  checkbox: {
    borderRadius: 4,
  },
  radioSelected: {
    backgroundColor: COLORS.PINK,
    borderWidth: 0,
  },
});
