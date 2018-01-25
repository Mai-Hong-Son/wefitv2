/**
 * @providesModule WeFit.Components.PurchaseReceipt
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';

// Components
import FlexibleScrollView from 'app/components/Reusables/FlexibleScrollView';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { PAYMENT_TYPES } from 'redux/constants';

// Models
import MembershipPack from 'app/models/MembershipPack';
import PaymentOrder from 'app/models/PaymentOrder';
import PromoData from 'app/models/PromoData';

// Locals
import FooterButton from './FooterButton';
import MembershipPackCard from './MembershipPackCard';
import withConnect from './withConnect';

const { ATM, CREDIT } = PAYMENT_TYPES;

@withConnect
export default class PurchaseReceipt extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('purchaseReceipt.title'),
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          membershipPack: PropTypes.instanceOf(MembershipPack).isRequired,
          promotion: PropTypes.instanceOf(PromoData),
        }).isRequired,
      }).isRequired,
    }).isRequired,
    paymentOrderRequest: PropTypes.shape({
      data: PropTypes.instanceOf(PaymentOrder),
      loading: PropTypes.isRequired,
    }).isRequired,
    requestPaymentOrder: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.requestPaymentOrder = this.props.requestPaymentOrder.bind(this);
    this.state = { currentPaymentType: null };
  }

  componentWillReceiveProps(nextProps) {
    const { paymentOrderRequest } = this.props;
    const { paymentOrderRequest: nextPaymentOrderRequest } = nextProps;

    if (paymentOrderRequest !== nextPaymentOrderRequest) {
      const { data, loading } = nextPaymentOrderRequest;
      if (!loading && data != null) this.navigatePaymentGateway(data);
    }
  }

  get passedProps() {
    const { membershipPack, promotion } = this.props.navigation.state.params;
    return { membershipPack, promotion };
  }

  navigatePaymentGateway = order => {
    const { navigation: { navigate } } = this.props;
    navigate(MAIN_ROUTES.PAYMENT_GATEWAY, { order });
    this.setState({ currentPaymentType: null });
  };

  onRequestPayment = type => {
    const { membershipPack: { id: membershipId }, promotion } = this.passedProps;
    const { code: promoCode } = promotion || {};
    this.setState({ currentPaymentType: type });
    this.requestPaymentOrder({ membershipId, promoCode, type });
  };

  render() {
    const { membershipPack } = this.passedProps;
    const { paymentOrderRequest: { loading } } = this.props;
    const { currentPaymentType } = this.state;

    const { atmCards, creditCards } = I18n.t('purchaseReceipt');

    return (
      <FlexibleScrollView
        autoLock
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        <MembershipPackCard data={membershipPack} />
        <View>
          <FooterButton
            disabled={loading && currentPaymentType !== CREDIT}
            loading={loading && currentPaymentType === CREDIT}
            onPress={() => this.onRequestPayment(CREDIT)}
            title={creditCards}
          />
          <FooterButton
            disabled={loading && currentPaymentType !== ATM}
            loading={loading && currentPaymentType === ATM}
            onPress={() => this.onRequestPayment(ATM)}
            title={atmCards}
          />
        </View>
      </FlexibleScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WEFIT,
    paddingHorizontal: 16,
  },
});
