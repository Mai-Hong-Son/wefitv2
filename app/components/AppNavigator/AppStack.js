/**
 * @providesModule WeFit.Components.AppNavigator.AppStack
 */

import {
  createNavigationContainer,
  createNavigator,
  StackRouter,
} from 'react-navigation';

// Components
import SplashScreen from 'app/components/SplashScreen';

// Constants
import { APP_ROUTES } from 'app/constants/RouteNames';

// Locals
import RootNavigator from './RootNavigator';
import SplashTransitioner from './Transitioners/SplashTransitioner';

const { ROOT, SPLASH } = APP_ROUTES;

const AppRouter = StackRouter({
  [SPLASH]: { screen: SplashScreen },
  [ROOT]: { screen: RootNavigator },
}, {
  initialRouteName: SPLASH,
});

const AppStack = createNavigationContainer(createNavigator(AppRouter)(SplashTransitioner));

export default AppStack;
