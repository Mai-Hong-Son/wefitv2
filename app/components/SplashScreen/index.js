/**
 * @providesModule WeFit.Components.SplashScreen
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';
import Video from 'react-native-video';
import { DeviceUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { FEATURES } from 'app/constants/Flags';

const { width: SCREEN_WIDTH } = DeviceUtils.screen;

export default function SplashScreen({ sceneIndex, transition }) {
  const content = (
    <Video
      muted
      resizeMode="cover"
      source={require('app/assets/images/logo.mp4')}
      style={styles.logo}
    />
  );

  if (transition == null || FEATURES.NON_ANIMATED_SPLASH_SCREEN)
    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  
  const { position } = transition;
  
  const opacity = position.interpolate({
    inputRange: [sceneIndex - 1, sceneIndex, sceneIndex + 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {content}
    </Animated.View>
  );
}

SplashScreen.propTypes = {
  sceneIndex: PropTypes.number,
  transition: PropTypes.object,
};

SplashScreen.defaultProps = {
  sceneIndex: 0,
  transition: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: COLORS.WEFIT,
  },

  logo: {
    height: SCREEN_WIDTH * 400 / 1080,
    width: SCREEN_WIDTH,
  },
});
