/**
 * @providesModule WeFit.Components.Reusables.Buttons.AnimatedButton
 */

import React from 'react';
import { Animated } from 'react-native';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

// Locals
import TextButton from './TextButton';

export default function AnimatedButton({ animatedStyle, ...buttonProps }) {
  const { fitContent } = buttonProps;
  const containerStyles = [
    !fitContent && SHEETS.stretched,
    animatedStyle,
  ];

  return (
    <Animated.View style={containerStyles}>
      <TextButton {...buttonProps} />
    </Animated.View>
  );
}

AnimatedButton.propTypes = {
  ...TextButton.propTypes,
  animatedStyle: Animated.View.propTypes.style,
};

AnimatedButton.defaultProps = {
  ...TextButton.defaultProps,
  animatedStyle: null,
};
