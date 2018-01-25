/**
 * @providesModule WeFit.Components.Reusables.FadedNavigationHeader
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Constants
import { COLORS, HEADER_HEIGHT, SHEETS } from 'app/constants/AppStyles';

export default function FadedNavigationHeader({ children, color, gradient, transitionOffset }) {
  const opacity = transitionOffset.interpolate({
    inputRange: [-1, 0, HEADER_HEIGHT],
    outputRange: [1, 1, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[SHEETS.absoluteFlex, { opacity, backgroundColor: color }]} />
      {gradient && (
        <LinearGradient
          colors={['rgba(41, 41, 65, 0.5)', 'transparent']}
          end={{ x: 0.5, y: 1 }}
          start={{ x: 0.5, y: 0 }}
          style={SHEETS.absoluteFlex}
        />
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

FadedNavigationHeader.propTypes = {
  children: PropTypes.element,
  color: PropTypes.string,
  gradient: PropTypes.bool,
  transitionOffset: PropTypes.instanceOf(Animated.Value),
};

FadedNavigationHeader.defaultProps = {
  children: null,
  color: COLORS.WEFIT,
  gradient: false,
  transitionOffset: new Animated.Value(0),
};

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  
  content: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'space-between',
  },
});
