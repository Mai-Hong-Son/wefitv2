/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.RootStack
 */

import { StackNavigator } from 'react-navigation';

// Components
import PersonalInfo from 'app/components/PersonalInfo';

// Constants
import { NAVIGATION_OPTIONS } from 'app/constants/AppStyles';
import { ROOT_ROUTES } from 'app/constants/RouteNames';

// Locals
import AuthStack from './AuthStack';
import IntroStack from './IntroStack';
import MainNavigator from './MainNavigator';

const { AUTH, INTRO, MAIN, UPDATE_INFO } = ROOT_ROUTES;

const RootStack = StackNavigator({
  [MAIN]: { screen: MainNavigator },
  [AUTH]: { screen: AuthStack },
  [INTRO]: { screen: IntroStack },
  [UPDATE_INFO]: { screen: PersonalInfo },
}, {
  headerMode: 'none',
  initialRouteName: MAIN,
  mode: 'modal',
  navigationOptions: {
    ...NAVIGATION_OPTIONS,
    gesturesEnabled: false,
  },
});

export default RootStack;
