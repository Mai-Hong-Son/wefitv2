/**
 * @providesModule WeFit.Components.ReviewsDetail.ReviewsList.DataRow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import RatingStars from 'app/components/Reusables/RatingStars';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import Review from 'app/models/Review';

export default function DataRow({ review }) {
  const { content, rating_score: score, session } = review;
  if (session == null) return null;
  
  const { name, instructor_name: instructorName } = session || {};

  return (
    <View style={styles.container}>
      <RatingStars max={5} score={score} size={12} width={76} />
      <Text style={styles.name}>
        {name}
        {!_.isEmpty(instructorName) && ' - '}
        {!_.isEmpty(instructorName) && <Text style={styles.instructorName}>{instructorName}</Text>}
      </Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
}

DataRow.propTypes = {
  review: PropTypes.instanceOf(Review).isRequired,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.stretched,
    alignItems: 'flex-start',
    borderBottomColor: COLORS.ALL_E,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  name: FontUtils.build({
    color: COLORS.WEFIT,
    size: 14,
    weight: 'semibold',

    // Extra
    marginBottom: 7,
    marginTop: 6,
  }),
  instructorName: FontUtils.build({
    color: COLORS.TRIPLE_6E,
    size: 14,
    style: 'italic',
    weight: 'semibold',
  }),
  content: FontUtils.build({
    color: COLORS.WEFIT,
    size: 14,
  }),
});
