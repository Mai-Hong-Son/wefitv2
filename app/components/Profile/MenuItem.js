/**
 * @providesModule WeFit.Components.Profile.MenuItem
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function MenuItem({ icon, onPress, title }) {
  return (
    <Button containerStyle={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Image source={icon} />
      </View>
    </Button>
  );
}

MenuItem.propTypes = {
  icon: Image.propTypes.source.isRequired,
  onPress: PropTypes.func,
  title: PropTypes.string.isRequired,
};

MenuItem.defaultProps = {
  onPress: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.shadow,
    backgroundColor: 'white',
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
  },

  content: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'space-between',
  },

  title: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,
  }),
});
