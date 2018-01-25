/**
 * @providesModule WeFit.Components.StudiosMap.StudioCallout
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import Button from 'react-native-button';
import { Callout } from 'react-native-maps';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Models
import Studio from 'app/models/Studio';

const PROP_TYPES = {
  available: PropTypes.bool.isRequired,
  onPress: PropTypes.func,
  studio: PropTypes.instanceOf(Studio).isRequired,
};

const DEFAULT_PROPS = {
  onPress: null,
};

function StudioCalloutAndroid({ available, onPress, studio }) {
  const color = available ? COLORS.PINK : COLORS.TRIPLE_6E;
  const { name } = studio;

  return (
    <Callout onPress={() => available && onPress(studio)} style={styles.container}>
      <Button disabled={!available} style={[styles.title, { color }]}>
        {name}
      </Button>
    </Callout>
  );
}

StudioCalloutAndroid.propTypes = PROP_TYPES;
StudioCalloutAndroid.defaultProps = DEFAULT_PROPS;

function StudioCalloutIOS({ available, onPress, studio }) {
  const color = available ? COLORS.PINK : COLORS.TRIPLE_6E;
  const { name } = studio;

  return (
    <Callout style={styles.container}>
      <Button
        disabled={!available}
        onPress={() => onPress(studio)}
        style={[styles.title, { color }]}
      >
        {name}
      </Button>
    </Callout>
  );
}

StudioCalloutIOS.propTypes = PROP_TYPES;
StudioCalloutIOS.defaultProps = DEFAULT_PROPS;

const StudioCallout = Platform.select({ android: StudioCalloutAndroid, ios: StudioCalloutIOS });

export default StudioCallout;

const styles = StyleSheet.create({
  container: {
    width: 200,
    ...Platform.select({ android: { padding: 5 } }),
  },
  title: FontUtils.build({
    align: 'center',
    size: 17,
    weight: 'bold',

    // Extra
    flex: 1,
  }),
});
