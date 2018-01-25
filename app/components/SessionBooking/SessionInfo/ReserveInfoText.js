/**
 * @providesModule WeFit.Components.SessionBooking.SessionInfo.ReserveInfoText
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Models
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Utils
import { buildWeekDayFormat, formatText } from 'app/utils';

export default function ReserveInfoText({ session, studio }) {
  const { duration, startMoment } = session;
  const { address, name: studioName } = studio;

  const startTime = startMoment.format('HH:mm');
  const { date, weekDay } = buildWeekDayFormat();
  const startDate = _.capitalize(startMoment.format(`${weekDay} (${date})`));

  return (
    <View style={styles.container}>
      <Text style={styles.studioName}>{studioName}</Text>
      <Text style={styles.infoText}>{`${startTime} - ${startDate}`}</Text>
      <Text style={styles.infoText}>
        {formatText(I18n.t('sessionBooking.sessionDuration'), duration)}
      </Text>
      <Text style={styles.infoText}>{address}</Text>
    </View>
  );
}

ReserveInfoText.propTypes = {
  session: PropTypes.instanceOf(Session).isRequired,
  studio: PropTypes.instanceOf(Studio).isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    marginHorizontal: 16,
    marginTop: 7,
  },
  studioName: FontUtils.build({
    align: 'center',
    color: COLORS.PINK,
    size: 17,
    style: 'italic',
  }),
  infoText: FontUtils.build({
    align: 'center',
    color: 'white',

    // Extra
    marginTop: 4,
  }),
});
