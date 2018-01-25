/**
 * @providesModule WeFit.Components.Reusables.FadedMask
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet } from 'react-native';

export default function FadedMask({ color, height, scrollOffset }) {
  const maskOpacity = scrollOffset.interpolate({
    inputRange: [-height, 0, height],
    outputRange: [0, 0, 1],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.mask, { backgroundColor: color, opacity: maskOpacity }]}
    />
  );
}

FadedMask.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number.isRequired,
  scrollOffset: PropTypes.instanceOf(Animated.Value).isRequired,
};

FadedMask.defaultProps = {
  color: 'black',
};

const styles = StyleSheet.create({
  mask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});
