/**
 * @providesModule WeFit.Components.Reusables.FitnessTypeIcon.SingleTypeIcon
 */

import React from 'react';
import { Image, Text, View } from 'react-native';
import _ from 'lodash';

// Locals
import { DEFAULT_PROPS, OTHER_ICON_STYLES_MAPPING, PROP_TYPES, variants } from './constants';
import { getIconSizes, getIconSource, getTypeColor } from './utils';
import styles from './styles';

export { getIconSizes, getIconSource, getTypeColor, variants };

export default function SingleTypeIcon({ available, types, variant }) {
  const iconSizes = getIconSizes({ variant });
  const iconSource = getIconSource({ available, types, variant });
  const { [variant]: otherIcon } = OTHER_ICON_STYLES_MAPPING;

  if (iconSource != null)
    return <Image source={iconSource} style={iconSizes} />;
  
  const backgroundColor = getTypeColor({ available, types: _.slice(types, 0, 1) });

  return (
    <View style={[styles.container, iconSizes, { backgroundColor }]}>
      <Text style={[styles.textIcon, otherIcon]}>{'•••'}</Text>
    </View>
  );
}

SingleTypeIcon.propTypes = PROP_TYPES;
SingleTypeIcon.defaultProps = DEFAULT_PROPS;
