/**
 * @providesModule WeFit.Components.AppNavigator
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, NetInfo, Text } from 'react-native';
import { NavigationActions, addNavigationHelpers } from 'react-navigation';
import { DeviceUtils, FontUtils } from '@onaclover/react-native-utils';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Ionicons';

// Constants
import { APP_ROUTES } from 'app/constants/RouteNames';

// Locals
import AppStack from './AppStack';
import GlobalAlert from './GlobalAlert';
import reducers from './reducers';
import withConnect from './withConnect';

export { reducers };

@withConnect
export default class AppNavigator extends React.PureComponent {
  static propTypes = {
    appRouter: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    rehydrated: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.dispatch = this.props.dispatch.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);
    this.checkingNetwork = this.checkingNetwork.bind(this);

    this.state = {
      status: null,
    };
  }

  componentDidMount() {
    this.checkingNetwork();
  }
  
  componentDidUpdate(prevProps) {
    const { rehydrated } = this.props;
    const { rehydrated: prevRehydrated } = prevProps;
    
    // Rehydration finish
    if (!prevRehydrated && rehydrated)
      this.navigateRootNav();
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  checkingNetwork() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

    NetInfo.isConnected.fetch().then(
      isConnected => { this.setState({ status: isConnected }); }
    );
  }

  handleConnectionChange(isConnected) {
    this.setState({ status: isConnected });

    const { status } = this.state;

    if (!status) {
      this.modelView.open();
    } else {
      this.modelView.close();
    }
  }
  
  navigateRootNav = () => this.dispatch(NavigationActions.navigate({ routeName: APP_ROUTES.ROOT }));

  render() {
    const { appRouter: state, dispatch } = this.props;

    return (
      <View style={styles.container}>
        <AppStack navigation={addNavigationHelpers({ dispatch, state })} />
        <GlobalAlert />
        <Modal
          backdrop={false}
          position={'top'}
          ref={ref => this.modelView = ref}
          style={styles.modalWarning}
        >
          <View style={styles.wrapWarning}>
            <View style={styles.iconWarning}>
              <Icon color="#fff" name="ios-warning" size={35} />
            </View>
            <View style={styles.textWarning}>
              <Text style={styles.title}>{I18n.t('globalAlert.checkNetwork.title')}</Text>
              <Text style={styles.message}>{I18n.t('globalAlert.checkNetwork.message')}</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /**
     * Android with API level < 21 will render StatusBar with solid 20px
     * which means all views will be 20px lower than expected
     */
    marginTop: DeviceUtils.androidLowLevelApi ? -20 : 0,
  },
  modalWarning: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 85,
    backgroundColor: '#ff9800',
  },
  wrapWarning: {
    flexDirection:'row',
    alignItems: 'center',
    paddingTop: 15,
  },
  iconWarning: {
    width: '12%',
  },
  textWarning: {
    width: '80%',
  },
  message: FontUtils.build({
    color: 'white',
  }),
  title: FontUtils.build({
    color: 'white',
    size: 17,
    weight: 'semibold',
  }),
});
