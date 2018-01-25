/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.GalleryBox.PlayButton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Platform, StyleSheet } from 'react-native';
import Button from 'react-native-button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function PlayButton({ height, onPress, scrollOffset }) {
  const scale = scrollOffset.interpolate({
    inputRange: [-height, 0, height],
    outputRange: [1, 0.5, 0.5],
  });

  return (
    <Button onPress={onPress}>
      <Animated.View style={[styles.container, { transform: [{ scale }] }]}>
        <FontAwesome color={COLORS.PINK} name="play" size={45} style={styles.icon} />
      </Animated.View>
    </Button>
  );
}

PlayButton.propTypes = {
  height: PropTypes.number.isRequired,
  onPress: PropTypes.func,
  scrollOffset: PropTypes.instanceOf(Animated.Value).isRequired,
};

PlayButton.defaultProps = {
  onPress: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    borderRadius: 40,
    flex: 0,
    height: 80,
    overflow: 'hidden',
    width: 80,
  },
  icon: {
    backgroundColor: 'transparent',
    height: 80,
    width: 80,
    paddingLeft: 27,
    ...Platform.select({ android: { paddingTop: 16 }, ios: { lineHeight: 80 } }),
  },
});
