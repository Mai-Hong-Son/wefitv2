/**
 * @providesModule WeFit.Components.ReviewsDetail.ReviewsList.EmptyRow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { REVIEWS_DETAIL_TABS } from 'redux/constants';

export default function EmptyRow({ tabId }) {
  const { forSession, forStudio, title } = I18n.t('detailScrollView.reviewsDetail.empty');
  const subTitle = tabId === REVIEWS_DETAIL_TABS.SESSION ? forSession : forStudio;

  return (
    <View style={SHEETS.horizontalFlex}>
      <View style={styles.content}>
        <Image source={require('app/assets/icons/no-results.png')} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
    </View>
  );
}

EmptyRow.propTypes = {
  tabId: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },
  title: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',

    // Extra
    marginBottom: 15,
    marginTop: 20,
  }),
  subTitle: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
  }),
});
