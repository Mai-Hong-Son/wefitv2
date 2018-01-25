/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.SessionContentBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import I18n from 'react-native-i18n';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Utils
import { buildWeekDayFormat, formatText } from 'app/utils';

export default function SessionContentBox({ session, studio, style }) {
  const { duration, name: sessionName, startMoment } = session;
  const { name: studioName } = studio || {};

  const startTime = startMoment.format('HH:mm');
  const { date, weekDay } = buildWeekDayFormat();
  const startDate = _.capitalize(startMoment.format(`${weekDay} (${date})`));
  
  return (
    <View style={[styles.container, style]}>
      <Text numberOfLines={1} style={styles.sessionName}>{sessionName}</Text>
      <Text numberOfLines={1} style={styles.studioName}>{studioName}</Text>
      <View style={styles.timestamps}>
        <View style={styles.timestampContainer}>
          <FontAwesome color={COLORS.ALL_6} name="calendar" size={13} />
          <Text style={styles.timestamp}>{`${startTime} - ${startDate}`}</Text>
        </View>
        <View style={[styles.timestampContainer, styles.durationContainer]}>
          <FontAwesome color={COLORS.ALL_6} name="clock-o" size={13} />
          <Text style={styles.timestamp}>
            {formatText(I18n.t('sessionDetail.duration'), duration)}
          </Text>
        </View>
      </View>
    </View>
  );
}

SessionContentBox.propTypes = {
  session: PropTypes.instanceOf(Session).isRequired,
  studio: PropTypes.instanceOf(Studio).isRequired,
  style: ViewPropTypes.style,
};

SessionContentBox.defaultProps = {
  style: null,
};

const styles = StyleSheet.create({
  container: {
    height: Platform.select({ android: 78, ios: 68 }),
    justifyContent: 'space-between',
  },

  sessionName: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',
  }),
  studioName: FontUtils.build({
    color: COLORS.ALL_6,
    size: 12,
    style: 'italic',
  }),
  timestamps: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'flex-start',
  },
  timestampContainer: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'flex-start',
  },
  durationContainer: {
    marginLeft: 16,
  },
  timestamp: FontUtils.build({
    color: COLORS.ALL_6,

    // Extra
    marginLeft: 3,
  }),
});
