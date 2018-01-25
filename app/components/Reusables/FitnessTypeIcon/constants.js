/**
 * @providesModule WeFit.Components.Reusables.FitnessTypeIcon.contants
 */

import PropTypes from 'prop-types';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Models
import { FitnessType } from 'app/models/BaseStaticData';

const DETAIL_SCROLL_VIEW = 'detailScrollView';
const MAPS = 'maps';
const SESSION_ROW = 'sessionRow';

export const ICON_SIZES_MAPPING = { [DETAIL_SCROLL_VIEW]: 50, [MAPS]: 30, [SESSION_ROW]: 26 };

export const OTHER_ICON_STYLES_MAPPING = {
  [DETAIL_SCROLL_VIEW]: {
    fontSize: 20,
    marginBottom: 3,
  },
  [MAPS]: {
    fontSize: 11,
    marginBottom: 2,
  },
  [SESSION_ROW]: {
    fontSize: 10,
    marginBottom: 2,
  },
};

export const MAPS_ICONS_MAPPING = {
  A: {
    disabled: require('app/assets/fitness-type-icons/maps/aerobics-disabled.png'),
    normal: require('app/assets/fitness-type-icons/maps/aerobics.png'),
  },
  B: {
    disabled: require('app/assets/fitness-type-icons/maps/beauty-disabled.png'),
    normal: require('app/assets/fitness-type-icons/maps/beauty.png'),
  },
  D: {
    disabled: require('app/assets/fitness-type-icons/maps/dance-disabled.png'),
    normal: require('app/assets/fitness-type-icons/maps/dance.png'),
  },
  G: {
    disabled: require('app/assets/fitness-type-icons/maps/gym-disabled.png'),
    normal: require('app/assets/fitness-type-icons/maps/gym.png'),
  },
  K: {
    disabled: require('app/assets/fitness-type-icons/maps/kickboxing-disabled.png'),
    normal: require('app/assets/fitness-type-icons/maps/kickboxing.png'),
  },
  M: {
    disabled: require('app/assets/fitness-type-icons/maps/martialart-disabled.png'),
    normal: require('app/assets/fitness-type-icons/maps/martialart.png'),
  },
  S: {
    disabled: require('app/assets/fitness-type-icons/maps/swimming-disabled.png'),
    normal: require('app/assets/fitness-type-icons/maps/swimming.png'),
  },
  Y: {
    disabled: require('app/assets/fitness-type-icons/maps/yoga-disabled.png'),
    normal: require('app/assets/fitness-type-icons/maps/yoga.png'),
  },
  Z: {
    // reuse dance icons
    disabled: require('app/assets/fitness-type-icons/maps/dance-disabled.png'),
    normal: require('app/assets/fitness-type-icons/maps/zumba.png'),
  },
};

export const TYPE_COLORS_MAPPING = {
  A: '#009688',
  B: '#ff829f',
  D: '#f44336',
  G: '#3f51b5',
  K: '#ff9800',
  M: '#ffc107',
  S: '#2196f3',
  Y: '#4caf50',
  Z: '#ec407a',
  disabled: COLORS.ALL_9,
  other: '#83358b',
};

export const TYPE_ICONS_MAPPING = {
  A: {
    disabled: require('app/assets/fitness-type-icons/aerobics-disabled.png'),
    normal: require('app/assets/fitness-type-icons/aerobics.png'),
  },
  B: {
    disabled: require('app/assets/fitness-type-icons/beauty-disabled.png'),
    normal: require('app/assets/fitness-type-icons/beauty.png'),
  },
  D: {
    disabled: require('app/assets/fitness-type-icons/dance-disabled.png'),
    normal: require('app/assets/fitness-type-icons/dance.png'),
  },
  G: {
    disabled: require('app/assets/fitness-type-icons/gym-disabled.png'),
    normal: require('app/assets/fitness-type-icons/gym.png'),
  },
  K: {
    disabled: require('app/assets/fitness-type-icons/kickboxing-disabled.png'),
    normal: require('app/assets/fitness-type-icons/kickboxing.png'),
  },
  M: {
    disabled: require('app/assets/fitness-type-icons/martialart-disabled.png'),
    normal: require('app/assets/fitness-type-icons/martialart.png'),
  },
  S: {
    disabled: require('app/assets/fitness-type-icons/swimming-disabled.png'),
    normal: require('app/assets/fitness-type-icons/swimming.png'),
  },
  Y: {
    disabled: require('app/assets/fitness-type-icons/yoga-disabled.png'),
    normal: require('app/assets/fitness-type-icons/yoga.png'),
  },
  Z: {
    disabled: require('app/assets/fitness-type-icons/dance-disabled.png'), // reuse dance icons
    normal: require('app/assets/fitness-type-icons/zumba.png'),
  },
};

export const variants = { DETAIL_SCROLL_VIEW, MAPS, SESSION_ROW };

export const PROP_TYPES = {
  available: PropTypes.bool,
  types: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)),
  variant: PropTypes.oneOf([DETAIL_SCROLL_VIEW, MAPS, SESSION_ROW]).isRequired,
};

export const DEFAULT_PROPS = {
  available: true,
  types: [],
};
