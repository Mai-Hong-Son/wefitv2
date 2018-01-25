/**
 * @providesModule WeFit.Components.StudioDetail.TitleBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import Studio from 'app/models/Studio';

export default function TitleBox({ schedulesButton, studio }) {
  const { address, logo_link: logoUri, name } = studio || {};

  const defaultSource = require('app/assets/images/placeholder-logo.png');
  const sourceProps = logoUri == null
    ? { source: defaultSource }
    : { defaultSource, source: { uri: logoUri } };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image {...sourceProps} style={styles.logo} />
        <View style={styles.infoBox}>
          <Text numberOfLines={1} style={styles.name}>{name}</Text>
          <Text numberOfLines={2} style={styles.address}>{address}</Text>
        </View>
      </View>
      {schedulesButton}
    </View>
  );
}

TitleBox.propTypes = {
  schedulesButton: PropTypes.any,
  studio: PropTypes.instanceOf(Studio),
};

TitleBox.defaultProps = {
  schedulesButton: null,
  studio: null,
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ALL_C,
    marginHorizontal: -16,
    paddingBottom: 20,
  },
  content: {
    ...SHEETS.horizontalFlex,
    alignItems: 'flex-start',
    height: Platform.select({ android: 98, ios: 88 }),
    marginHorizontal: 16,
    marginTop: 20,
  },
  
  logo: {
    borderRadius: 4,
    height: 70,
    overflow: 'hidden',
    width: 70,
  },

  infoBox: {
    flex: 1,
    marginLeft: 10,
  },
  name: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',

    // Extra
    marginBottom: 6,
  }),
  address: FontUtils.build({
    color: COLORS.ALL_6,
    size: 12,
    style: 'italic',

    // Extra
    marginBottom: 10,
  }),
});
