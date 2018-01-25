/**
 * @providesModule WeFit.Components.Reusables.FitnessTypeIcon
 */

import React from 'react';

// Locals
import { DEFAULT_PROPS, PROP_TYPES, variants } from './constants';
import MultipleTypesIcon from './MultipleTypesIcon';
import SingleTypeIcon from './SingleTypeIcon';
import { getIconSizes, getIconSource, getTypeColor } from './utils';

export { getIconSizes, getIconSource, getTypeColor, variants };

export default function FitnessTypeIcon(props) {
  const { types, variant } = props;

  if (variant === variants.MAPS && types.length > 1)
    return <MultipleTypesIcon {...props} />;
  
  return <SingleTypeIcon {...props} />;
}

FitnessTypeIcon.propTypes = PROP_TYPES;
FitnessTypeIcon.defaultProps = DEFAULT_PROPS;
