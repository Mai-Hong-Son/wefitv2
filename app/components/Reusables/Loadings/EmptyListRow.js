/**
 * @providesModule WeFit.Components.Reusables.Loadings.EmptyListRow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, ViewPropTypes } from 'react-native';

// Locals
import styles from './styles';

export default function EmptyListRow({ message, style }) {
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
