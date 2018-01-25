/**
 * @providesModule WeFit.Components.Reusables.ParallaxScrollView.ParallaxBackground
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View, ViewPropTypes } from 'react-native';

export default function ParallaxBackground({ children, height, maskColor, scrollOffset, style }) {
  const heightValue = scrollOffset.interpolate({
    inputRange: [-height, 0, height],
    outputRange: [height * 2, height, height],
  });

  const top = scrollOffset.interpolate({
    inputRange: [-height, 0, height],
    outputRange: [0, 0, -height / 3],
  });

  const mask = maskColor != null && (
    <View pointerEvents="none" style={[styles.mask, { backgroundColor: maskColor }]} />
  );

  return (
    <Animated.View style={[styles.container, style, { top, height: heightValue }]}>
      {children}
      {mask}
    </Animated.View>
  );
}

ParallaxBackground.propTypes = {
  children: PropTypes.element,
  height: PropTypes.number.isRequired,
  maskColor: PropTypes.string,
  scrollOffset: PropTypes.instanceOf(Animated.Value),
  style: ViewPropTypes.style,
};

ParallaxBackground.defaultProps = {
  children: null,
  maskColor: null,
  scrollOffset: new Animated.Value(0),
  style: null,
};

const styles = StyleSheet.create({
  container: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  mask: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
