/**
 * @providesModule WeFit.Components.Home.Swiper.TitleBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function TitleBox({ hasMore, onSeeAll, title }) {
  if (_.isEmpty(title)) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {hasMore && (
        <Button containerStyle={styles.seeAllContainer} onPress={onSeeAll}>
          <Text style={styles.seeAllText}>{I18n.t('home.swiper.seeAll')}</Text>
          <FontAwesome color={COLORS.PINK} name="chevron-right" size={12} style={styles.chevron} />
        </Button>
      )}
    </View>
  );
}

TitleBox.propTypes = {
  hasMore: PropTypes.bool,
  onSeeAll: PropTypes.func,
  title: PropTypes.string,
};

TitleBox.defaultProps = {
  hasMore: false,
  onSeeAll: null,
  title: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  title: FontUtils.build({
    color: COLORS.TRIPLE_6E,
    size: 17,
    weight: 'semibold',
  }),

  seeAllContainer: {
    ...SHEETS.horizontalFlex,
  },  
  seeAllText: FontUtils.build({
    color: COLORS.PINK,
    size: 14,
  }),
  chevron: {
    backgroundColor: 'transparent',
    marginLeft: 4,
  },
});
