/**
 * @providesModule WeFit.Components.Reusables.PagedGallery.PaginationDot
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, ViewPropTypes } from 'react-native';

export default function PaginationDot({ activeColor, defaultColor, index, pageOffset, style }) {
  const backgroundColor = pageOffset.interpolate({
    inputRange: [index - 1.01, index - 1, index, index + 1, index + 1.01],
    outputRange: [defaultColor, defaultColor, activeColor, defaultColor, defaultColor],
  });

  return <Animated.View style={[styles.dot, style, { backgroundColor }]} />;
}

PaginationDot.propTypes = {
  activeColor: PropTypes.string,
  defaultColor: PropTypes.string,
  index: PropTypes.number.isRequired,
  pageOffset: PropTypes.instanceOf(Animated.Value).isRequired,
  style: ViewPropTypes.style,
};

PaginationDot.defaultProps = {
  activeColor: '#fff',
  defaultColor: '#fff8',
  style: null,
};

const styles = StyleSheet.create({
  dot: {
    borderRadius: 4,
    height: 8,
    marginHorizontal: 3,
    width: 8,
  },
});
