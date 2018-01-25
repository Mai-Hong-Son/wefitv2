/**
 * @providesModule WeFit.Components.SessionsListing.SessionsListView.DataRow.DetailInfo
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Utils
import { formatText } from 'app/utils';

// Locals
import RatingScore from './RatingScore';
import ReservedMark from './ReservedMark';

const { MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES } = MAIN_ROUTES;

export default function DetailInfo({ available, session, studio, variant }) {
  const {
    currentSessionOrder,
    instructor_name: instructor,
    is_reserved: reserved,
    name,
    rating_score: ratingScore,
    reservationCode,
  } = session;

  const { name: studioName, short_address: address } = studio || {};
  const showsStudioName = variant !== STUDIO_SCHEDULES && !_.isEmpty(studioName);

  const { currentSession: template } = I18n.t('sessionsListing.dataRow');

  return (
    <View style={styles.container}>
      <Text style={[styles.name, !available && styles.disabledText]}>{name}</Text>
      {currentSessionOrder != null && (
        <Text style={styles.currentSession}>{formatText(template, currentSessionOrder)}</Text>
      )}
      {showsStudioName && <Text style={styles.info}>{studioName}</Text>}
      {!_.isEmpty(address) && <Text style={styles.info}>{address}</Text>}
      {!_.isEmpty(instructor) && (
        <Text style={styles.info}>
          {formatText(I18n.t('sessionsListing.dataRow.instructor'), instructor)}
        </Text>
      )}
      <RatingScore disabled={!available} score={ratingScore} />
      <ReservedMark reservationCode={reservationCode} reserved={reserved} variant={variant} />
    </View>
  );
}

DetailInfo.propTypes = {
  available: PropTypes.bool,
  session: PropTypes.instanceOf(Session).isRequired,
  studio: PropTypes.instanceOf(Studio),
  variant: PropTypes.oneOf([MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES]).isRequired,
};

DetailInfo.defaultProps = {
  available: true,
  studio: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  name: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',
  }),
  currentSession: FontUtils.build({
    color: COLORS.PURPLE,
    style: 'italic',
    
    // Extra
    marginTop: 8,
  }),
  info: FontUtils.build({
    color: COLORS.TRIPLE_6E,

    // Extra
    marginTop: 8,
  }),
  disabledText: {
    color: COLORS.TRIPLE_6E,
  },
});
