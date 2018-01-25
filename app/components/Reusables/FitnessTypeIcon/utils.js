/**
 * @providesModule WeFit.Components.Reusables.FitnessTypeIcon.utils
 */

import _ from 'lodash';

// Locals
import {
  ICON_SIZES_MAPPING, MAPS_ICONS_MAPPING, TYPE_COLORS_MAPPING, TYPE_ICONS_MAPPING, variants,
} from './constants';

export function getIconSizes({ variant }) {
  const { [variant]: size } = ICON_SIZES_MAPPING;

  return {
    borderRadius: size / 2,
    height: size,
    width: size,
  };
}

export function getIconSource({ available, types, variant }) {
  if (_.isEmpty(types) || (variant === variants.MAPS && types.length > 1)) return undefined;
  
  const iconsMapping = variant === variants.MAPS ? MAPS_ICONS_MAPPING : TYPE_ICONS_MAPPING;
  const { code } = types[0] || {};
  const { [code]: icons = {} } = iconsMapping;
  
  const state = available ? 'normal' : 'disabled';
  return icons[state];
}

export function getTypeColor({ available, types }) {
  const { disabled, other } = TYPE_COLORS_MAPPING;
  if (!available) return disabled;
  if (_.isEmpty(types)) return other;
  
  const { code } = types[0] || {};
  return TYPE_COLORS_MAPPING[code] || other;
}
