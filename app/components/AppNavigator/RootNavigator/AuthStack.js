/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.AuthStack
 */

import { StackNavigator } from 'react-navigation';

// Components
import EmailLogin from 'app/components/EmailAuth/Login';
import EmailSignUp from 'app/components/EmailAuth/SignUp';
import ForgotPassword from 'app/components/EmailAuth/ForgotPassword';
import ResetPassword from 'app/components/EmailAuth/ResetPassword';
import Welcome from 'app/components/Welcome';

// Constants
import { NAVIGATION_OPTIONS, NAVIGATION } from 'app/constants/AppStyles';
import { AUTH_ROUTES } from 'app/constants/RouteNames';

const { EMAIL_LOGIN, EMAIL_SIGNUP, FORGOT_PASSWORD, RESET_PASSWORD, WELCOME } = AUTH_ROUTES;

const AuthStack = StackNavigator({
  [WELCOME]: { screen: Welcome, navigationOptions: { headerStyle: NAVIGATION.emptyHeader } },
  [EMAIL_LOGIN]: { screen: EmailLogin },
  [EMAIL_SIGNUP]: { screen: EmailSignUp },
  [FORGOT_PASSWORD]: { screen: ForgotPassword },
  [RESET_PASSWORD]: { screen: ResetPassword, path: 'reset_password' },
}, {
  initialRouteName: WELCOME,
  navigationOptions: {
    ...NAVIGATION_OPTIONS,
    headerStyle: NAVIGATION.transparentHeader,
  },
});

export default AuthStack;
