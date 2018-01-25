/**
 * @providesModule WeFit.Components.Reusables.Loadings.LoadingOverlay
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import Spinner from 'react-native-spinkit';

// Locals
import styles from './styles';

export default function LoadingOverlay({ color, size, style, type, visible }) {
  if (!visible) return null;

  return (
    <View style={[styles.loadingOverlay, style]}>
      <Spinner color={color} isVisible size={size} type={type} />
    </View>
  );
}

LoadingOverlay.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  style: ViewPropTypes.style,
  type: PropTypes.string,
  visible: PropTypes.bool,
};

LoadingOverlay.defaultProps = {
  color: '#ffffff',
  size: 50,
  type: 'Pulse',
  style: null,
  visible: false,
};
