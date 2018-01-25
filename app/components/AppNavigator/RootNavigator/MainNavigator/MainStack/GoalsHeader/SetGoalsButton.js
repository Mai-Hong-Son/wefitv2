/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.MainStack.GoalsHeader.SetGoalsButton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function SetGoalsButton({ onPress }) {
  return (
    <Button containerStyle={styles.container} onPress={onPress}>
      <Image source={require('app/assets/icons/goals.png')} />
      <Text style={styles.text}>{I18n.t('setGoals.header.setButton')}</Text>
    </Button>
  );
}

SetGoalsButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    backgroundColor: COLORS.PURPLE,
    borderRadius: 4,
    height: 32,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  text: FontUtils.build({
    color: 'white',
    size: 14,
    weight: 'semibold',

    // Extra
    marginLeft: 6,
  }),
});
