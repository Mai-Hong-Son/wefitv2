/**
 * @providesModule WeFit.Components.ReviewsDetail.RatingsCard
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import formatNumber from 'format-number';

// Components
import RatingStars from 'app/components/Reusables/RatingStars';

// Constants
import { HEADER_HEIGHT, SHEETS } from 'app/constants/AppStyles';

// Utils
import { formatText } from 'app/utils';

// Locals
import ScoresProgress from './ScoresProgress';

export default function RatingsCard({ ratingStatus }) {
  const { count, score, scoresTable } = ratingStatus;
  const formattedScore = formatNumber({ padRight: 1 })(score);
  const { plural, singular } = I18n.t('detailScrollView.ratingInfo');
  const template = count > 1 ? plural : singular;

  return (
    <View style={styles.container}>
      <View style={styles.overallInfo}>
        <Text style={styles.score}>{`${formattedScore}/5`}</Text>
        <RatingStars score={score} size={13} width={76} />
        <Text style={styles.count}>{formatText(template, count)}</Text>
      </View>
      <ScoresProgress scores={scoresTable} total={count} />
    </View>
  );
}

RatingsCard.propTypes = {
  loading: PropTypes.bool,
  ratingStatus: PropTypes.shape({
    count: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired,
    scoresTable: ScoresProgress.propTypes.scores,
  }).isRequired,
};

RatingsCard.defaultProps = {
  loading: true,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    height: 136,
    justifyContent: 'space-between',
    marginTop: HEADER_HEIGHT,
    padding: 16,
    paddingBottom: 30,
  },

  overallInfo: {
    alignItems: 'flex-start',
  },
  score: FontUtils.build({
    color: 'white',
    size: 40,
  }),
  count: FontUtils.build({
    color: 'white',
    size: 14,
    
    // Extra
    marginTop: 5,
  }),
});
