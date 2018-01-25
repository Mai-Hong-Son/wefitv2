/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator
 */
 
import React from 'react';
import PropTypes from 'prop-types';
import { BackHandler } from 'react-native';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import I18n from 'react-native-i18n';
import { Extensions } from '@onaclover/react-native-utils';
import _ from 'lodash';
 
// Constants
import { DEBUGS } from 'app/constants/Flags';
import { ROOT_ROUTES } from 'app/constants/RouteNames';
import { GLOBAL_ALERT_TYPES } from 'redux/constants';
 
// Models
import Membership from 'app/models/Membership';
import User from 'app/models/User';
 
// Locals
import RootStack from './RootStack';
import withConnect from './withConnect';
 
const { AUTH, INTRO, UPDATE_INFO } = ROOT_ROUTES;
 
@withConnect
export default class RootNavigator extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    mainRouter: PropTypes.object.isRequired,
    membership: PropTypes.instanceOf(Membership),
    rootRouter: PropTypes.object.isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
    userData: PropTypes.instanceOf(User),
  };
 
  static defaultProps = {
    membership: null,
    userData: null,
  };
 
  constructor(props) {
    super(props);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
  }
 
  componentDidMount() {
    BackHandler.addEventListener('backPress', this.onBackHandler);
    if (this.props.userData == null) this.presentScreen(AUTH);
  }
 
  componentDidUpdate(prevProps) {
    this.handlePropsChanged(prevProps);
  }
 
  alertNewcomer = () => {
    const { message, title } = I18n.t('personalInfo.newcomerAlert');
    this.showGlobalAlert({ message, title, type: GLOBAL_ALERT_TYPES.INFO });
  };
 
  dismissTopScreens = () => {
    const { dispatch, rootRouter: { index, routes } } = this.props;
 
    // Stack at current index will be popped
    const { key } = routes[index];
    dispatch(NavigationActions.back({ key }));
  };
 
  handlePropsChanged = async prevProps => {
    const { membership, userData } = this.props;
    const { membership: prevMembership, userData: prevUserData } = prevProps;
 
    if (userData !== prevUserData) {
      // User log-out
      if (prevUserData != null && userData == null) {
        this.presentScreen(AUTH);
        return;
      }
       
      // User log-in
      if (prevUserData == null && userData != null)
        this.dismissTopScreens();
 
      const { city_code: cityCode } = userData;
 
      if (_.isEmpty(cityCode)) {
        await Extensions.nap(0);
        this.presentScreen(UPDATE_INFO);
        this.alertNewcomer();
        return;
      }
    }
    
    if (userData != null && membership !== prevMembership) {
      const { status } = membership;
      const { status: prevStatus } = prevMembership || {};
      
      if (status === 'new' || DEBUGS.INTRO_SCREEN) {
        await Extensions.nap(0);
        this.presentScreen(INTRO);
        return;
      }
 
      if (status !== prevStatus && status === 'trial') {
        this.dismissTopScreens();
        return;
      }
    }
  };
 
  presentScreen = routeName => {
    const { dispatch } = this.props;
    dispatch(NavigationActions.navigate({ routeName }));
  };
 
  onBackHandler = () => {
    const { dispatch, mainRouter, rootRouter: { index: rootIndex, routes } } = this.props;
    const { index, routeName } = routes[rootIndex];
 
    const backAction = NavigationActions.back();
     
    switch (routeName) {
      case ROOT_ROUTES.AUTH: {
        // If user in auth stack's inner screens, then back as normal
        if (index > 0) return dispatch(backAction);
 
        // Otherwise disable back action
        return true;
      }
       
      // Handle back as normal for other cases
      default: {
        const { index: mainIndex } = mainRouter;
        if (mainIndex > 0) return dispatch(backAction);
        return false;
      }
    }
  };
 
  render() {
    const { dispatch, rootRouter: state } = this.props;
    return <RootStack navigation={addNavigationHelpers({ dispatch, state })} />;
  }
}
