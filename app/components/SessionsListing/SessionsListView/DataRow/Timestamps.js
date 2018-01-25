/**
 * @providesModule WeFit.Components.SessionsListing.SessionsListView.DataRow.Timestamps
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import moment from 'moment';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Utils
import { formatText } from 'app/utils';

const { MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES } = MAIN_ROUTES;

export default function Timestamps({ color, duration, time, variant }) {
  const startHour = time.format('HH:mm');
  const weekDay = _.capitalize(time.format('dddd'));
  const date = time.format(I18n.t('formats.shortDate'));

  return (
    <View style={styles.container}>
      <Text numberOfLines={1} style={[styles.startHour, { color }]}>{startHour}</Text>
      {variant === MY_SESSIONS && <Text numberOfLines={1} style={styles.duration}>{weekDay}</Text>}
      {variant === MY_SESSIONS && <Text numberOfLines={1} style={styles.duration}>{date}</Text>}
      <Text numberOfLines={1} style={styles.duration}>
        {formatText(I18n.t('sessionsListing.dataRow.duration'), duration)}
      </Text>
    </View>
  );
}

Timestamps.propTypes = {
  color: PropTypes.string,
  duration: PropTypes.number.isRequired,
  time: PropTypes.instanceOf(moment).isRequired,
  variant: PropTypes.oneOf([MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES]).isRequired,
};

Timestamps.defaultProps = {
  color: COLORS.ALL_9,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
    flex: 0,
    width: 78,
  },
  startHour: FontUtils.build({
    align: 'center',
    size: 17,
    weight: 'semibold',
  }),
  duration: FontUtils.build({
    align: 'center',
    color: COLORS.ALL_9,

    // Extra
    marginTop: 8,
  }),
});
