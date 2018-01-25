/**
 * @providesModule WeFit.Components.SessionBooking.SessionInfo
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

// Components
import FitnessTypeIcon, {
  variants as FitnessTypeIconVariants,
} from 'app/components/Reusables/FitnessTypeIcon';
import WarningBox, { variants as WarningBoxVariants } from 'app/components/Reusables/WarningBox';

// Models
import { FitnessType } from 'app/models/BaseStaticData';
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Locals
import SessionBookingModes from '../modes';
import CancelInfoText from './CancelInfoText';
import ReserveInfoText from './ReserveInfoText';

const { DETAIL_SCROLL_VIEW } = FitnessTypeIconVariants;
const { RESERVE_CANCEL } = WarningBoxVariants;

export default function SessionInfo({ fitnessTypes, mode, session, studio }) {
  const { name: sessionName } = session;

  const content = mode === SessionBookingModes.CANCEL
    ? <CancelInfoText session={session} />
    : <ReserveInfoText session={session} studio={studio} />;

  return (
    <View style={styles.container}>
      <FitnessTypeIcon types={fitnessTypes} variant={DETAIL_SCROLL_VIEW} />
      <Text style={styles.sessionName}>{sessionName}</Text>
      {content}
      <WarningBox message={I18n.t('sessionBooking.warning')} variant={RESERVE_CANCEL} />
    </View>
  );
}

SessionInfo.propTypes = {
  fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
  mode: PropTypes.oneOf(_.values(SessionBookingModes)).isRequired,
  session: PropTypes.instanceOf(Session).isRequired,
  studio: PropTypes.instanceOf(Studio).isRequired,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  sessionName: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 17,
    weight: 'semibold',

    // Extra
    marginTop: 20,
  }),
});
