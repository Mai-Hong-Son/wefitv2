/**
 * @providesModule WeFit.Components.AppNavigator.trackingScreen
 */
import { NavigationActions } from 'react-navigation';
import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';
// import moment from 'moment';

const GA_TRACKING_ID = 'UA-112538285-2';
export const tracker = new GoogleAnalyticsTracker(GA_TRACKING_ID);

function getRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }

  const route = navigationState.routes[navigationState.index];

  if (route.routes) {
    return getRouteName(route);
  }

  if (route.params) {
    if (route.params.title)
      return route.params.title;
    // if (route.params.session) {
    //   const { session: { name, start_at: timeS, end_at: timeE } } = route.params;
    //   if (route.params.mode) {
    //     return `${name} - ${moment(timeS).format('DD/MM/YY (h:mm a)')} - ${route.params.mode}`;
    //   }
    //   return `${name} - ${moment(timeS).format('DD/MM/YY (h:mm a)')} - ${moment(timeE).format('DD/MM/YY (h:mm a)')}`;
    // }
    // if (route.params.studio) {
    //   return `${route.routeName} - ${route.params.studio.name}`;
    // }
  }

  if (route.routeName === 'home')
    return 'Home';
  
  return null;
}

const screenTracking = ({ getState }) => next => action => {
  if (
    action.type !== NavigationActions.NAVIGATE
    && action.type !== NavigationActions.BACK
  ) {
    return next(action);
  }

  const currentScreen = getRouteName(getState().mainRouter);
  // console.warn(currentScreen);
  const result = next(action);
  const nextScreen = getRouteName(getState().mainRouter);
  // console.warn(nextScreen);

  if (nextScreen !== currentScreen) {
    tracker.trackScreenView(nextScreen);
  } else {
    tracker.trackScreenView(currentScreen);
  }

  if (nextScreen === 'Home')
    tracker.trackTiming('TrackTimeLoading', 13000, { name: 'LoadHome' });

  return result;
};

export default screenTracking;
