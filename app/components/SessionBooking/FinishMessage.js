/**
 * @providesModule WeFit.Components.SessionBooking.FinishMessage
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import ReservationCodeBox from 'app/components/Reusables/ReservationCodeBox';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function FinishMessage({ contents, onCopyCode, reservationCode, title }) {
  const { hasCode, noCode } = contents;
  const message = _.isEmpty(reservationCode) ? noCode : hasCode;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome color="white" name="check" size={35} style={styles.icon} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{message}</Text>
      <ReservationCodeBox code={reservationCode} onCopy={onCopyCode} />
    </View>
  );
}

FinishMessage.propTypes = {
  contents: PropTypes.shape({
    hasCode: PropTypes.string,
    noCode: PropTypes.string.isRequired,
  }).isRequired,
  onCopyCode: PropTypes.func,
  reservationCode: PropTypes.string,
  title: PropTypes.string.isRequired,
};

FinishMessage.defaultProps = {
  onCopyCode: null,
  reservationCode: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
  },

  iconContainer: {
    backgroundColor: COLORS.PINK,
    borderRadius: 25,
    height: 50,
    width: 50,
  },

  icon: {
    backgroundColor: 'transparent',
    height: 50,
    width: 50,
    paddingLeft: 7,
    ...Platform.select({ android: { paddingTop: 8 }, ios: { lineHeight: 50 } }),
  },

  title: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',

    // Extra
    marginTop: 20,
  }),
  content: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,

    // Extra
    marginBottom: 4,
    marginTop: 13,
  }),
});
