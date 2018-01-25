/**
 * @providesModule WeFit.Components.SessionsListing.SessionsListView.DataRow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import _ from 'lodash';

// Components
import FitnessTypeIcon, {
  getTypeColor,
  variants as FitnessTypeIconVariants,
} from 'app/components/Reusables/FitnessTypeIcon';

// Constants
import { SHEETS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { MY_SESSIONS_TABS } from 'redux/constants';

// Models
import { FitnessType } from 'app/models/BaseStaticData';
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';
import AccountSettings from 'app/models/AccountSettings';

// Locals
import DetailInfo from './DetailInfo';
import Timestamps from './Timestamps';

const { MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES } = MAIN_ROUTES;
const { SESSION_ROW } = FitnessTypeIconVariants;

export default function DataRow({ fitnessTypes, onSelect, session, studio, tabId, userSettings, variant }) {
  const { duration, is_available: isAvailable, is_reserved: isReserved, startMoment } = session;
  const available = tabId === MY_SESSIONS_TABS.PAST ? false : (isAvailable || isReserved);
  const color = getTypeColor({ available, types: fitnessTypes });
  const { hide_unavailable_sessions: hideUnavailableSessions } = userSettings;

  if (hideUnavailableSessions && !isAvailable && !isReserved) return null;

  return (
    <Button onPress={() => onSelect(session, studio)}>
      <View style={styles.container}>
        <FitnessTypeIcon available={available} types={fitnessTypes} variant={SESSION_ROW} />
        <View style={styles.content}>
          <Timestamps color={color} duration={duration} time={startMoment} variant={variant} />
          <DetailInfo available={available} session={session} studio={studio} variant={variant} />
        </View>
      </View>
    </Button>
  );
}

DataRow.propTypes = {
  fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
  onSelect: PropTypes.func.isRequired,
  session: PropTypes.instanceOf(Session).isRequired,
  studio: PropTypes.instanceOf(Studio),
  tabId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(_.values(MY_SESSIONS_TABS)),
  ]).isRequired,
  userSettings: PropTypes.instanceOf(AccountSettings).isRequired,
  variant: PropTypes.oneOf([MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES]).isRequired,
};

DataRow.defaultProps = {
  studio: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    padding: 16,
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 4,
  },
});
