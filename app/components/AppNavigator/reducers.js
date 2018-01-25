/**
 * @providesModule WeFit.Components.AppNavigator.reducers
 */

import { NavigationActions } from 'react-navigation';

// Utils
import RoutersMiddleware from 'app/utils/RoutersMiddleware';

// Locals
import AppStack from './AppStack';
import RootStack from './RootNavigator/RootStack';
import MainStack from './RootNavigator/MainNavigator/MainStack';

function appRouterReducer(state, action) {
  const { BACK, RESET } = NavigationActions;
  const { type } = action;

  // Disable BACK & RESET actions for this router
  if (type === BACK || type === RESET) return state;
  
  const duplicatedNavigate = RoutersMiddleware.duplicatedNavigate(action, 'appRouter');
  if (duplicatedNavigate) return state;

  return AppStack.router.getStateForAction(action, state) || state;
}

function mainRouterReducer(state, action) {
  const duplicatedNavigate = RoutersMiddleware.duplicatedNavigate(action, 'mainRouter');
  if (duplicatedNavigate) return state;

  return MainStack.router.getStateForAction(action, state) || state;
}

function rootRouterReducer(state, action) {
  const duplicatedNavigate = RoutersMiddleware.duplicatedNavigate(action, 'rootRouter');
  if (duplicatedNavigate) return state;
  
  if (action.type === NavigationActions.RESET) return state;
  return RootStack.router.getStateForAction(action, state) || state;
}

export default {
  appRouter: appRouterReducer,
  mainRouter: mainRouterReducer,
  rootRouter: rootRouterReducer,
};
