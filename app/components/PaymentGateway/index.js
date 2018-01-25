/**
 * @providesModule WeFit.Components.PaymentGateway
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';
import { Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import InteractiveWebView from 'app/components/Reusables/InteractiveWebView';

// Constants
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Models
import Membership from 'app/models/Membership';
import PaymentOrder from 'app/models/PaymentOrder';

// Locals
import withConnect from './withConnect';

@withConnect
export default class PaymentGateway extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('paymentGateway.title'),
  });

  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          order: PropTypes.instanceOf(PaymentOrder).isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    router: PropTypes.shape({
      index: PropTypes.number.isRequired,
      routes: PropTypes.arrayOf(PropTypes.shape({
        index: PropTypes.number.isRequired,
        key: PropTypes.string.isRequired,
        routeName: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
    updateMembership: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
    this.updateMembership = this.props.updateMembership.bind(this);
  }

  get passedProps() {
    const { order } = this.props.navigation.state.params;
    return { order };
  }

  onPaymentCallback = event => {
    try {
      const { nativeEvent: { data } } = event;
      const { status, message, membership: membershipData } = JSON.parse(data);

      const membership = Membership.build(membershipData);
      Logger.debug({ data, status, message, membership });
      
      if (status !== 'success') throw new Error(message);
      this.onPaymentSuccess(membership);
    } catch (error) {
      this.onPaymentFailed(error);
    }
  };

  onPaymentFailed = error => {
    const { navigation: { goBack } } = this.props;
    const { message } = error || {};
    
    goBack();

    if (!_.isEmpty(message)) {
      const { title } = I18n.t('paymentGateway.alert');
      this.showGlobalAlert({ message, title, type: GLOBAL_ALERT_TYPES.ERROR });
    }
  };

  onPaymentSuccess = membership => {
    const { navigation: { goBack }, router: { index, routes } } = this.props;
    this.updateMembership(membership);

    const { key } = routes[index];
    goBack(key);

    const { membershipStatus, success, title } = I18n.t('paymentGateway.alert');
    const expireStats = membership.buildExpireStatsText(membershipStatus);
    const message = `${success}, ${expireStats}`;
    this.showGlobalAlert({ message, title, type: GLOBAL_ALERT_TYPES.SUCCESS });
  };

  render() {
    const { order: { checkout_url: uri } } = this.passedProps;
    return <InteractiveWebView onMessage={this.onPaymentCallback} uri={uri} />;
  }
}
