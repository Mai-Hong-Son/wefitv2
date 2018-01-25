/**
 * @providesModule WeFit.Components.Reusables.Loadings.LoadingPlaceholder
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, ViewPropTypes } from 'react-native';
import Spinner from 'react-native-spinkit';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Locals
import styles from './styles';

export function EmptyListRow({ message, style }) {
  return (
    <View style={[styles.loadingListRow, style]}>
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}

EmptyListRow.propTypes = {
  message: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

EmptyListRow.defaultProps = {
  style: null,
};

export default function LoadingPlaceholder({ color, size, style, type, visible }) {
  if (!visible) return null;
  
  return (
    <View style={[styles.loadingListRow, style]}>
      <Spinner color={color} isVisible={visible} size={size} type={type} />
    </View>
  );
}

LoadingPlaceholder.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  style: ViewPropTypes.style,
  type: PropTypes.string,
  visible: PropTypes.bool,
};

LoadingPlaceholder.defaultProps = {
  color: COLORS.WEFIT,
  size: 50,
  style: null,
  type: 'Pulse',
  visible: true,
};
