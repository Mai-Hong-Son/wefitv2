/**
 * @providesModule WeFit.Components.StudiosMap.StudioMarker
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { Marker } from 'react-native-maps';

// Components
import FitnessTypeIcon, {
  getIconSource,
  variants as FitnessTypeIconVariants,
} from 'app/components/Reusables/FitnessTypeIcon';

// Models
import { FitnessType } from 'app/models/BaseStaticData';
import Studio from 'app/models/Studio';

// Locals
import StudioCallout from './StudioCallout';

const { MAPS } = FitnessTypeIconVariants;

const PROP_TYPES = {
  available: PropTypes.bool.isRequired,
  fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
  onNavigateStudio: PropTypes.func,
  onSelectMarker: PropTypes.func,
  selectedStudioId: PropTypes.number,
  showsCallout: PropTypes.bool,
  studio: PropTypes.instanceOf(Studio).isRequired,
};

const DEFAULT_PROPS = {
  onSelectMarker: null,
  onNavigateStudio: null,
  selectedStudioId: 0,
  showsCallout: true,
};

function StudioMarkerAndroid({ available, fitnessTypes, onNavigateStudio, showsCallout, studio }) {
  const { location } = studio;
  const iconSource = getIconSource({
    available, types: fitnessTypes, variant: FitnessTypeIconVariants.MAPS,
  });

  return (
    <Marker coordinate={location} image={iconSource}>
      {iconSource == null && (
        <FitnessTypeIcon available={available} types={fitnessTypes} variant={MAPS} />
      )}
      {showsCallout && (
        <StudioCallout available={available} onPress={onNavigateStudio} studio={studio} />
      )}
    </Marker>
  );
}

StudioMarkerAndroid.propTypes = PROP_TYPES;
StudioMarkerAndroid.defaultProps = DEFAULT_PROPS;

function StudioMarkerIOS({
  available, fitnessTypes, onNavigateStudio, onSelectMarker, selectedStudioId, showsCallout, studio,
}) {
  const { id, location } = studio;

  return (
    <Marker
      coordinate={location}
      onPress={() => onSelectMarker(studio)}
      zIndex={selectedStudioId === id ? 999 : 0}
    >
      <FitnessTypeIcon available={available} types={fitnessTypes} variant={MAPS} />
      {showsCallout && (
        <StudioCallout available={available} onPress={onNavigateStudio} studio={studio} />
      )}
    </Marker>
  );
}

StudioMarkerIOS.propTypes = PROP_TYPES;
StudioMarkerIOS.defaultProps = DEFAULT_PROPS;

const StudioMarker = Platform.select({ android: StudioMarkerAndroid, ios: StudioMarkerIOS });

export default StudioMarker;
