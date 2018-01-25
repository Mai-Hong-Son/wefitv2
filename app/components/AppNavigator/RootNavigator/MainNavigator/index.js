/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.MainNavigator
 */

import React from 'react';
import PropTypes from 'prop-types';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';

// Constants
import { ROOT_ROUTES } from 'app/constants/RouteNames';

// Models
import User from 'app/models/User';

// Locals
import MainStack from './MainStack';
import withConnect from './withConnect';

@withConnect
export default class MainNavigator extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    mainRouter: PropTypes.object.isRequired,
    userData: PropTypes.instanceOf(User),
  };
  
  static defaultProps = {
    userData: null,
  };

  componentWillReceiveProps(nextProps) {
    const { userData } = this.props;
    const { userData: nextUserData } = nextProps;

    if (userData != null && nextUserData == null)
      this.resetTabs();
  }

  resetTabs = () => {
    const { dispatch } = this.props;

    // Reset Main tabs
    const actions = [NavigationActions.navigate({ routeName: ROOT_ROUTES.MAIN })];
    const resetAction = NavigationActions.reset({ actions, index: 0, key: null });
    dispatch(resetAction);
  };

  render() {
    const { dispatch, language, userData, mainRouter: state } = this.props;
    if (userData == null) return null;

    return (
      <MainStack
        navigation={addNavigationHelpers({ dispatch, state })}
        screenProps={{ language }}
      />
    );
  }
}
