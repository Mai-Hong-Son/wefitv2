/**
 * @providesModule WeFit.Components.Reusables.ParallaxHeader
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';

export default function ParallaxHeader({ children, scrollOffset, height }) {
  const heightValue = scrollOffset.interpolate({
    inputRange: [-height, 0, height],
    outputRange: [height * 2, height, height],
  });

  return (
    <Animated.View style={{ height: heightValue }}>
      {children}
    </Animated.View>
  );
}

ParallaxHeader.propTypes = {
  children: PropTypes.element,
  height: PropTypes.number.isRequired,
  scrollOffset: PropTypes.instanceOf(Animated.Value),
};

ParallaxHeader.defaultProps = {
  children: null,
  scrollOffset: new Animated.Value(0),
};

