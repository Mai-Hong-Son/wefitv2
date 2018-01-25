/**
 * @providesModule WeFit.Components.SessionsListing.SessionsListView.EmptyRow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { MY_SESSIONS_TABS } from 'redux/constants';

const { MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES } = MAIN_ROUTES;

function getTexts({ hasFilters, tabId, variant }) {
  if (variant === MY_SESSIONS) {
    const { subTitle, titles: { past, upcoming } } = I18n.t('mySessions.empty');
    const title = tabId === MY_SESSIONS_TABS.UPCOMING ? upcoming : past;
    return { subTitle, title };
  }

  if (variant === STUDIO_SCHEDULES) {
    const { subTitle, title } = I18n.t('studioSchedules.empty');
    return { subTitle, title };
  }

  const { hasFilters: hasFiltersTexts, noFilters } = I18n.t('sessionsListing.empty');
  return hasFilters ? hasFiltersTexts : noFilters;
}

export default function EmptyRow({ hasFilters, onViewSchedules, tabId, variant }) {
  const { subTitle, title } = getTexts({ hasFilters, tabId, variant });
  const viewSchedulesButton = (
    <TextButton
      bordering
      darkTitle
      fitContent
      onPress={onViewSchedules}
      title={I18n.t('mySessions.empty.viewSchedules')}
    />
  );

  return (
    <View style={styles.container}>
      <Image source={require('app/assets/icons/no-results.png')} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subTitle}>{subTitle}</Text>
      {variant === MY_SESSIONS && viewSchedulesButton}
    </View>
  );
}

EmptyRow.propTypes = {
  hasFilters: PropTypes.bool,
  onViewSchedules: PropTypes.func,
  tabId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  variant: PropTypes.oneOf([MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES]).isRequired,
};

EmptyRow.defaultProps = {
  hasFilters: false,
  onViewSchedules: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.stretched,
    padding: 16,
    paddingTop: 60,
  },
  
  title: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',

    // Extra
    marginBottom: 15,
    marginTop: 20,
  }),
  subTitle: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,

    // Extra
    marginBottom: 20,
  }),
});
