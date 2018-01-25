/**
 * @providesModule WeFit.Redux.Actions.Navigations
 */

import { NavigationActions } from 'react-navigation';
// import { Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { MAIN_ROUTES, ROOT_ROUTES } from 'app/constants/RouteNames';

// Models
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

const {
  HOME, MY_SESSIONS, INTERNAL_WEB_BROWSER, OVERALL_SCHEDULES,
  PROFILE, SESSION_DETAIL, STUDIOS_MAP, STUDIO_DETAIL,
} = MAIN_ROUTES;
const { MAIN } = ROOT_ROUTES;

const MAIN_TABS = [HOME, OVERALL_SCHEDULES, STUDIOS_MAP, MY_SESSIONS, PROFILE];

export function navigateSession({ session, variant }) {
  if (!(session instanceof Session)) return;

  return (dispatch, getState) => {
    const {
      auth: { userData },
      mainRouter: { index, routes },
      staticData: { studiosByCity, studioIndices },
    } = getState();

    if (userData == null) return;

    // Check if current route is SessionDetail with session payload or not
    const { params, routeName } = routes[index];
    
    if (routeName === SESSION_DETAIL) {
      const { session: currentSession = {} } = params;
      if (currentSession.id === session.id) return;
    }

    // Current route is not SessionDetail nor session payload
    const { studio_id: studioId } = session;
    const studio = Studio.findById(studiosByCity, studioIndices, studioId);

    dispatch(NavigationActions.navigate({
      routeName: SESSION_DETAIL,
      params: { session, studio, variant },
    }));
  };
}

export function navigateStudio({ redirectToMaps = false, studioId }) {
  return (dispatch, getState) => {
    const {
      auth: { userData },
      mainRouter: { index, routes },
      staticData: { studiosByCity, studioIndices },
    } = getState();

    if (userData == null || (studioId == null && !redirectToMaps)) return;

    // No studioId provided but redirectToMaps has value
    if (studioId == null) return navigateMainTab(STUDIOS_MAP)(dispatch, getState);

    // Check if current route is StudioDetail with studio id or not
    const { params, routeName } = routes[index];
    
    if (routeName === STUDIO_DETAIL) {
      const { studio = {} } = params;
      if (studio.id === studioId) return;
    }

    // Current route is not StudioDetail nor studio id
    const { [studioId]: studioIndex } = studioIndices;
    const studio = _.get(studiosByCity, studioIndex);

    dispatch(NavigationActions.navigate({ routeName: STUDIO_DETAIL, params: { studio } }));
  };
}

export function navigateMainTab(tabName) {
  return (dispatch, getState) => {
    const { auth: { userData }, mainRouter: { routes } } = getState();
    if (userData == null) return;

    // Get 2 first routes in stack
    const [firstRoute, secondRoute] = routes;

    // Popping back before switching tab
    if (!_.isEmpty(secondRoute)) {
      const { key } = secondRoute;
      dispatch(NavigationActions.back({ key }));
    }

    // No `tabName` specified, remain to current main tab
    if (tabName == null) return;

    const { index, routeName } = firstRoute;

    // Switch tab if currently in a tab other than `tabName`
    if (routeName === MAIN && index !== _.indexOf(MAIN_TABS, tabName))
      dispatch(NavigationActions.navigate({ routeName: tabName }));
  };
}

export function navigateArticle(article) {
  return (dispatch, getState) => {
    const {
      auth: { userData },
      mainRouter: { index, routes },
    } = getState();

    if (userData == null) return;

    // Check if current route
    const { params, routeName } = routes[index];
    const { title, uri, id, type } = article;
    if (routeName === INTERNAL_WEB_BROWSER) {
      if (params.id === id)
        return;
    }

    dispatch(NavigationActions.navigate({
      routeName: INTERNAL_WEB_BROWSER,
      params: { title, uri, id, type },
    }));
  };
}
