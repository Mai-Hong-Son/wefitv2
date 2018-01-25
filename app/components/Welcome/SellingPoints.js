/**
 * @providesModule WeFit.Components.Welcome.SellingPoints
 */

import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS } from 'app/constants/AppStyles';

export default function SellingPoints() {
  return (
    <View style={styles.container}>
      <Text style={styles.introFirst}>{I18n.t('welcome.sellingPoints.0')}</Text>
      <Text style={styles.introSecond}>{I18n.t('welcome.sellingPoints.1')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderBottomColor: COLORS.ALL_9,
    borderBottomWidth: 1,
    justifyContent: 'center',
    marginBottom: 20,
    paddingBottom: 25,
  },
  introFirst: FontUtils.build({
    color: 'white',
    size: 17,

    // Extra
    marginBottom: 8,
    maxWidth: 180,
    ...Platform.select({ ios: { lineHeight: 24 } }),
  }),
  introSecond: FontUtils.build({
    color: COLORS.PINK,
    size: 24,
    weight: 'bold',
  }),
});
