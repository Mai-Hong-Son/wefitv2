/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.IntroStack
 */

import { StackNavigator } from 'react-navigation';

// Components
import IntroScreen from 'app/components/Tutorial';
import RedeemMembership from 'app/components/RedeemMembership';

// Constants
import { NAVIGATION_OPTIONS, NAVIGATION } from 'app/constants/AppStyles';
import { INTRO_ROUTES } from 'app/constants/RouteNames';

const { ACTIVATION, INTRO } = INTRO_ROUTES;

const IntroStack = StackNavigator({
  [INTRO]: { screen: IntroScreen },
  [ACTIVATION]: { screen: RedeemMembership },
}, {
  initialRouteName: INTRO,
  navigationOptions: {
    ...NAVIGATION_OPTIONS,
    headerStyle: NAVIGATION.transparentHeader,
  },
});

export default IntroStack;
