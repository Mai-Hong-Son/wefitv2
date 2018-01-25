/**
 * @providesModule WeFit.Components.EmptyRow
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function EmptyRow() {
  const { instruction, title } = I18n.t('favoriteStudios.empty');

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome color={COLORS.PINK} name="heart" size={16} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.instruction}>{instruction}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.stretched,
    marginTop: 116,
    paddingHorizontal: 16,
  },

  iconContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.ALL_C,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },

  title: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 17,
    weight: 'semibold',

    // Extra
    marginTop: 22,
  }),
  instruction: FontUtils.build({
    align: 'center',
    color: 'white',

    // Extra
    marginTop: 16,
  }),
});
