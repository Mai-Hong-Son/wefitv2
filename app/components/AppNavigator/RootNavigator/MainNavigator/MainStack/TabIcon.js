/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.MainStack.TabIcon
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

// Constants
import { MAIN_ROUTES } from 'app/constants/RouteNames';

const { HOME, OVERALL_SCHEDULES, STUDIOS_MAP, MY_SESSIONS, PROFILE } = MAIN_ROUTES;

const TAB_ICONS_MAPPER = {
  [HOME]: {
    highlighted: require('app/assets/tab-icons/home_highlighted.png'),
    normal: require('app/assets/tab-icons/home.png'),
  },
  [OVERALL_SCHEDULES]: {
    highlighted: require('app/assets/tab-icons/schedules_highlighted.png'),
    normal: require('app/assets/tab-icons/schedules.png'),
  },
  [STUDIOS_MAP]: {
    highlighted: require('app/assets/tab-icons/studios-map_highlighted.png'),
    normal: require('app/assets/tab-icons/studios-map.png'),
  },
  [MY_SESSIONS]: {
    highlighted: require('app/assets/tab-icons/my-sessions_highlighted.png'),
    normal: require('app/assets/tab-icons/my-sessions.png'),
  },
  [PROFILE]: {
    highlighted: require('app/assets/tab-icons/profile_highlighted.png'),
    normal: require('app/assets/tab-icons/profile.png'),
  },
};

export default function TabIcon({ name, focused }) {
  const { [name]: { highlighted, normal } } = TAB_ICONS_MAPPER;
  const source = focused ? highlighted : normal;
  return <Image source={source} />;
}

TabIcon.propTypes = {
  focused: PropTypes.bool,
  name: PropTypes.string,
};

TabIcon.defaultProps = {
  focused: false,
  name: null,
};

export function mainTabOptions(tabName) {
  return {
    navigationOptions: {
      tabBarIcon: props => <TabIcon name={tabName} {...props} />,
    },
  };
}
