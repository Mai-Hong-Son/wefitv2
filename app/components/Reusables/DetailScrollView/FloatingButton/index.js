/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.FloatingButton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Text } from 'react-native';
import Button from 'react-native-button';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Locals
import * as utils from './utils';

function getDisabledColor({ available, checkedIn }) {
  if (available) return null;
  if (checkedIn) return '#daeedb';
  return COLORS.ALL_E;
}

export default function FloatingButton({
  available, checkedIn, disabledMessage, floating, onPress, title, transitionOffset,
}) {
  const animationStyles = utils.buildAnimationStyles({
    available, floating, transitionOffset,
  });

  const backgroundColor = getDisabledColor({ available, checkedIn });

  const containerStyle = [
    styles.buttonContainer,
    !floating && available && styles.buttonContainerInner,
    !available && styles.buttonContainerDisabled,
    !available && { backgroundColor },
    animationStyles,
  ];

  return (
    <Animated.View style={containerStyle}>
      <Button containerStyle={styles.buttonContent} disabled={!available} onPress={onPress}>
        <Text style={[styles.buttonText, !available && styles.buttonTextDisabled]}>
          {available ? title : disabledMessage}
        </Text>
      </Button>
    </Animated.View>
  );
}

FloatingButton.propTypes = {
  available: PropTypes.bool,
  checkedIn: PropTypes.bool,
  disabledMessage: PropTypes.string,
  floating: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  transitionOffset: PropTypes.instanceOf(Animated.Value).isRequired,
};

FloatingButton.defaultProps = {
  available: true,
  checkedIn: false,
  disabledMessage: null,
  floating: false,
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: COLORS.PINK,
    borderRadius: 4,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonContainerInner: {
    marginHorizontal: 16,
  },
  buttonContainerDisabled: {
    backgroundColor: COLORS.ALL_E,
    borderRadius: 0,
  },
  buttonContent: {
    alignSelf: 'stretch',
  },
  buttonText: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 17,
    weight: 'semibold',

  }),
  buttonTextDisabled: FontUtils.build({
    align: 'center',
    color: COLORS.TRIPLE_6E,
    size: 14,
  }),
});
