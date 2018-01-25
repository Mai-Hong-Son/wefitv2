/**
 * @providesModule WeFit.Components.SessionsListing.SessionsListView.DataRow.RatingScore
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';

// Components
import RatingStars from 'app/components/Reusables/RatingStars';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function RatingScore({ disabled, score }) {
  const color = disabled ? COLORS.TRIPLE_6E : COLORS.STARS;

  return (
    <View style={styles.container}>
      <RatingStars color={color} score={score} size={14} width={76} />
      <Text style={styles.scoreText}>{score}</Text>
    </View>
  );
}

RatingScore.propTypes = {
  disabled: PropTypes.bool,
  score: PropTypes.number,
};

RatingScore.defaultProps = {
  disabled: false,
  score: 0,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  scoreText: FontUtils.build({
    color: COLORS.TRIPLE_6E,

    // Extra
    marginLeft: 5,
  }),
});
