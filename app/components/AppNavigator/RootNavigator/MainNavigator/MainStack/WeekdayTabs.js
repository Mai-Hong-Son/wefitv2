/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.MainStack.WeekdayTabs
 */

import React from 'react';
import { View } from 'react-native';
import { TabNavigator } from 'react-navigation';
import moment from 'moment';
import _ from 'lodash';

// Components
import SessionsListing from 'app/components/SessionsListing';
import StudiosMap from 'app/components/StudiosMap';

// Constants
import { APP_CONFIGS, FORMATS } from 'app/constants/AppConstants';
import { TABBAR_TOP_CONFIGS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Utils
import { buildWeekDayFormat } from 'app/utils';

const { WEEKDAY_TABS_COUNT } = APP_CONFIGS;
const { OVERALL_SCHEDULES, STUDIO_SCHEDULES, STUDIOS_MAP } = MAIN_ROUTES;

function buildNavigationOptions(tabId) {
  const today = moment().startOf('day');
  const nextDay = today.add(tabId, 'days');
  
  const dateId = nextDay.format(FORMATS.DATE_ID);
  const { date, weekDay } = buildWeekDayFormat();
  const title = _.capitalize(nextDay.format(`${weekDay}, ${date}`));

  return { dateId, tabId, title };
}

function getRouteConfigs(TabScene = View, routeName) {
  const tabIds = _.range(WEEKDAY_TABS_COUNT);
  const routeKeys = _.map(tabIds, id => `${routeName}Tab_${id}`);

  const routeValues = _.map(tabIds, tabId => ({
    navigationOptions: () => buildNavigationOptions(tabId),
    /* eslint-disable react/prop-types */
    screen: props => {
      // Passing TabNavigator passed params to TabScene
      const { navigation: { state: { params } } } = props;
      const extraProps = { tabParams: params, variant: routeName };
      return <TabScene {...props} {...buildNavigationOptions(tabId)} {...extraProps} />;
    },
    /* eslint-enable react/prop-types */
  }));

  return _.zipObject(routeKeys, routeValues);
}

function WeekdayTabs(TabScene, routeName) {
  return TabNavigator(getRouteConfigs(TabScene, routeName), TABBAR_TOP_CONFIGS);
}

export const OverallSchedulesTabs = WeekdayTabs(SessionsListing, OVERALL_SCHEDULES);

export const StudioSchedulesTabs = WeekdayTabs(SessionsListing, STUDIO_SCHEDULES);
StudioSchedulesTabs.navigationOptions = ({ navigation: { state: { params: { studio } } } }) => ({
  title: studio.name,
});

export const StudiosMapTabs = WeekdayTabs(StudiosMap, STUDIOS_MAP);
