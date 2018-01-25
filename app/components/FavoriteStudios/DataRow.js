/**
 * @providesModule WeFit.Components.DataRow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import LinearGradient from 'react-native-linear-gradient';
import { FontUtils } from '@onaclover/react-native-utils';

// Components
import { LoadingImage } from 'app/components/Reusables/Loadings';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import Studio from 'app/models/Studio';

export default function DataRow({ onSelect, studio }) {
  const { image_link: imageUri, name, short_address: address } = studio;

  return (
    <Button onPress={() => onSelect && onSelect(studio)}>
      <View style={styles.container}>
        <LoadingImage
          containerStyle={SHEETS.absoluteFlex}
          source={{ uri: imageUri }}
          style={styles.background}
        />
        <LinearGradient
          colors={[COLORS.PINK, COLORS.PURPLE]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={[SHEETS.absoluteFlex, styles.background, styles.backgroundGradient]}
        /> 
        <Text style={styles.name}>{name.toUpperCase()}</Text>
        <View style={styles.separator} />
        <Text style={styles.address}>{address}</Text>
      </View>
    </Button>
  );
}

DataRow.propTypes = {
  onSelect: PropTypes.func,
  studio: PropTypes.instanceOf(Studio).isRequired,
};

DataRow.defaultProps = {
  onSelect: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.stretched,
    borderRadius: 4,
    height: 228,
    margin: 16,
    marginBottom: 6,
    marginTop: 10,
    paddingHorizontal: 20,
  },

  background: {
    borderRadius: 4,
  },
  backgroundGradient: {
    opacity: 0.7,
  },

  name: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 20,
    weight: 'semibold',
  }),
  separator: {
    backgroundColor: 'white',
    height: 1,
    marginBottom: 10,
    marginTop: 35,
    width: 100,
  },
  address: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 14,
  }),
});
