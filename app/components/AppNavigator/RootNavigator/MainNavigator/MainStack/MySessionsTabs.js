/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.MainStack.MySessionsTabs
 */

import React from 'react';
import { View } from 'react-native';
import { TabNavigator } from 'react-navigation';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import SessionsListing from 'app/components/SessionsListing';

// Constants
import { TABBAR_TOP_CONFIGS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { MY_SESSIONS_TABS } from 'redux/constants';

const { UPCOMING, PAST } = MY_SESSIONS_TABS;
const { MY_SESSIONS } = MAIN_ROUTES;

const TAB_IDS = [UPCOMING, PAST];

function getTitle(tabId) {
  const { [tabId]: title } = {
    [UPCOMING]: I18n.t('mySessions.tabs.upcoming'),
    [PAST]: I18n.t('mySessions.tabs.past'),
  };

  return title;
}

function getRouteConfigs(TabScene = View) {
  const routeKeys = _.map(TAB_IDS, id => `${MAIN_ROUTES.MY_SESSIONS}Tab_${id}`);
  const routeValues = _.map(TAB_IDS, tabId => ({
    navigationOptions: () => ({ tabId, title: getTitle(tabId) }),
    /* eslint-disable react/prop-types */
    screen: props => {
      // Passing TabNavigator passed params to TabScene
      const { navigation: { state: { params } } } = props;
      const extraProps = { tabId, tabParams: params, variant: MY_SESSIONS };
      return <TabScene {...props} {...extraProps} />;
    },
    /* eslint-enable react/prop-types */
  }));

  return _.zipObject(routeKeys, routeValues);
}

const MySessionsTabs = TabNavigator(getRouteConfigs(SessionsListing), {
  ...TABBAR_TOP_CONFIGS,
  tabBarOptions: {
    ...TABBAR_TOP_CONFIGS.tabBarOptions,
    scrollEnabled: false,
  },
});

export default MySessionsTabs;
