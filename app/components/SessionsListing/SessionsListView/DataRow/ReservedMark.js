/**
 * @providesModule WeFit.Components.SessionListing.SessionsListView.DataRow.ReservedMark
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import ReservationCodeBox from 'app/components/Reusables/ReservationCodeBox';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

const { MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES } = MAIN_ROUTES;

export default function ReservedMark({ reservationCode, reserved, variant }) {
  if (!reserved) return null;
  if (variant === MY_SESSIONS && _.isEmpty(reservationCode)) return null;

  const content = !_.isEmpty(reservationCode)
    ? <ReservationCodeBox code={reservationCode} />
    : (
      <View style={styles.container}>
        <Text style={styles.text}>{I18n.t('sessionsListing.dataRow.reserved')}</Text>
      </View>
    );

  return (
    <View style={styles.wrapper}>
      {content}
    </View>
  );
}

ReservedMark.propTypes = {
  reservationCode: PropTypes.string,
  reserved: PropTypes.bool,
  variant: PropTypes.oneOf([MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES]).isRequired,
};

ReservedMark.defaultProps = {
  reservationCode: null,
  reserved: false,
};

const styles = StyleSheet.create({
  wrapper: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'flex-start',
  },

  container: {
    ...SHEETS.container,
    backgroundColor: COLORS.PURPLE,
    borderRadius: 4,
    flex: 0,
    height: 34,
    marginTop: 8,
    paddingHorizontal: 16,
  },

  text: FontUtils.build({
    color: 'white',
    size: 14,
  }),
});
