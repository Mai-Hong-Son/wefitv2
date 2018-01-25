/**
 * @providesModule WeFit.Components.Reusables.FitnessTypeIcon.MultipleTypesIcon
 */

import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Locals
import { DEFAULT_PROPS, PROP_TYPES, TYPE_COLORS_MAPPING } from './constants';
import styles from './styles';
import { getIconSizes } from './utils';

export default function MultipleTypesIcon({ available, types, variant }) {
  const iconSizes = getIconSizes({ variant });
  const { disabled } = TYPE_COLORS_MAPPING;

  const colors = available
    ? [COLORS.PINK, COLORS.PURPLE]
    : [disabled, disabled];
  
  return (
    <LinearGradient
      colors={colors}
      end={{ x: 1, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={[styles.container, iconSizes]}
    >
      <Text style={styles.textIcon}>{types.length}</Text>
    </LinearGradient>
  );
}

MultipleTypesIcon.propTypes = PROP_TYPES;
MultipleTypesIcon.defaultProps = DEFAULT_PROPS;
