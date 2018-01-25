/**
 * @providesModule WeFit.Components.SessionDetail.TitleBox.AlreadyReservedBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';
import ReservationCodeBox from 'app/components/Reusables/ReservationCodeBox';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

const AlreadyReservedBox = ({ cancellable, onCancel, reservationCode }) => {
  const { alreadyReserved, cancel } = I18n.t('sessionDetail.buttons');
  
  const reservedButton = (
    <TextButton
      containerStyle={styles.reservedButton}
      disabled
      flexSize
      title={alreadyReserved}
    />
  );
  const reservationCodeBox = <ReservationCodeBox code={reservationCode} />;
  const cancelButton = (
    <TextButton
      bordering
      containerStyle={styles.cancelButtonContainer}
      fitContent
      onPress={onCancel}
      title={cancel}
      titleColor={COLORS.PINK}
    />
  );

  return (
    <View style={styles.container}>
      {_.isEmpty(reservationCode) ? reservedButton : reservationCodeBox}
      {cancellable && cancelButton}
    </View>
  );
};

AlreadyReservedBox.propTypes = {
  cancellable: PropTypes.bool,
  onCancel: PropTypes.func,
  reservationCode: PropTypes.string,
};

AlreadyReservedBox.defaultProps = {
  cancellable: false,
  onCancel: null,
  reservationCode: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    marginHorizontal: 16,
  },
  
  reservedButton: {
    marginTop: 16,
  },
  cancelButtonContainer: {
    marginLeft: 16,
    marginTop: 16,
  },
});

export default AlreadyReservedBox;
