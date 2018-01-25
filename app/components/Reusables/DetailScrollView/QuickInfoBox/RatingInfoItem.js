/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.QuickInfoBox.RatingInfoItem
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Utils
import { formatText } from 'app/utils';

// Locals
import QuickInfoItem from './QuickInfoItem';

export default function RatingInfoItem({ count, onNodeRef, onPress, score }) {
  const icon = (
    <View style={styles.container}>
      <Text style={styles.title}>{Number(score).toFixed(1)}</Text>
    </View>
  );

  const { noRatings, plural, singular } = I18n.t('detailScrollView.ratingInfo');

  const hasRatings = count > 1 ? plural : singular;
  const title = count > 0 ? formatText(hasRatings, count) : noRatings;
  
  return <QuickInfoItem icon={icon} onNodeRef={onNodeRef} onPress={onPress} title={title} />;
}

RatingInfoItem.propTypes = {
  count: PropTypes.number,
  onNodeRef: PropTypes.func,
  onPress: PropTypes.func,
  score: PropTypes.number,
};

RatingInfoItem.defaultProps = {
  count: 0,
  onNodeRef: null,
  onPress: null,
  score: 0,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: COLORS.PURPLE,
    borderColor: COLORS.ALL_C,
    borderRadius: 25,
    flex: 0,
    height: 50,
    width: 50,
  },
  title: FontUtils.build({
    color: 'white',
    size: 20,
  }),
});
