/**
 * @providesModule WeFit.Components.SessionDetail.TitleBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import _ from 'lodash';

// Components
import { SessionContentBox } from 'app/components/Reusables/DetailScrollView';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Models
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Locals
import AlreadyReservedBox from './AlreadyReservedBox';

export default function TitleBox({ onCancel, reserveButton, session, studio }) {
  const {
    checked_in: checkedIn,
    is_cancellable: cancellable,
    is_reserved: reserved,
    reservationCode,
  } = session;

  const alreadyReservedBox = reserved && !_.isEmpty(reservationCode) && !checkedIn && (
    <AlreadyReservedBox
      cancellable={cancellable}
      onCancel={onCancel}
      reservationCode={reservationCode}
    />
  );

  return (
    <View style={styles.container}>
      <SessionContentBox session={session} studio={studio} style={styles.sessionContent} />
      {reserveButton != null && <View style={styles.reserveButtonContainer}>{reserveButton}</View>}
      {alreadyReservedBox}
      <View style={styles.separator} />
    </View>
  );
}

TitleBox.propTypes = {
  onCancel: PropTypes.func,
  reserveButton: PropTypes.any,
  session: PropTypes.instanceOf(Session).isRequired,
  studio: PropTypes.instanceOf(Studio),
};

TitleBox.defaultProps = {
  onCancel: null,
  reserveButton: null,
  studio: null,
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -16,
  },
  sessionContent: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  reserveButtonContainer: {
    marginTop: 20,
  },
  separator: {
    backgroundColor: COLORS.ALL_C,
    height: 1,
    marginHorizontal: 16,
    marginTop: 20,
  },
});
