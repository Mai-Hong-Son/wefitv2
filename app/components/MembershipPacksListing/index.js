/**
 * @providesModule WeFit.Components.MembershipPacksListing
 */

import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import { HotlineButton, TextButton } from 'app/components/Reusables/Buttons';
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
import MembershipPack from 'app/models/MembershipPack';
import RemoteConfigs from 'app/models/RemoteConfigs';

// Locals
import DataRow from './DataRow';
import PromoCodeBox from './PromoCodeBox';
import TermsCheckbox from './TermsCheckbox';
import withConnect from './withConnect';

@withConnect
export default class MembershipPacksListing extends React.PureComponent {
  static navigationOptions = ({ navigation: { goBack } }) => ({
    headerLeft: (
      <HeaderBackButton
        onPress={() => goBack(null)}
        pressColorAndroid="transparent"
        tintColor={COLORS.PINK}
      />
    ),
    title: I18n.t('membershipPacks.title'),
  });

  static propTypes = {
    getMembershipPacks: PropTypes.func.isRequired,
    membershipPacks: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.instanceOf(MembershipPack)).isRequired,
      error: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    remoteConfigs: PropTypes.instanceOf(RemoteConfigs).isRequired,
  };

  constructor(props) {
    super(props);
    this.getMembershipPacks = this.props.getMembershipPacks.bind(this);
    this.state = {
      membershipPacks: [],
      promoData: null,
      reloading: true,
      selectedPackId: null,
      termsAccepted: false,
    };
  }

  componentDidMount() {
    this.requestMembershipPacks();
  }

  componentWillReceiveProps(nextProps) {
    const { membershipPacks } = this.props;
    const { membershipPacks: nextMembershipPacks } = nextProps;
    
    if (membershipPacks !== nextMembershipPacks) {
      const { data, loading } = nextMembershipPacks;
      if (!loading && data != null) this.setState({ membershipPacks: data, reloading: false });
    }
  }

  navigatePackReceipt = () => {
    const { navigation: { navigate } } = this.props;
    const { membershipPacks, promoData: promotion, selectedPackId } = this.state;
    const membershipPack = _.find(membershipPacks, { id: selectedPackId });
    navigate(MAIN_ROUTES.PURCHASE_RECEIPT, { membershipPack, promotion });
  };

  requestMembershipPacks = () => {
    this.promoCodeBox.clear();
    this.getMembershipPacks();
  };

  onApplyPromoData = promoData => {
    const { memberships: membershipPacks } = promoData;
    this.setState({ membershipPacks, promoData });
  };
  
  onClearPromoData = () => {
    const { membershipPacks: { data } } = this.props;
    // Revert to original membership packs
    this.setState({ membershipPacks: data, promoData: null });
  };
  
  onOpenTerms = termsUri => {
    const { navigation: { navigate } } = this.props;
    const { terms } = I18n.t('membershipPacks.termsCheckbox');
    navigate(MAIN_ROUTES.INTERNAL_WEB_BROWSER, { title: _.upperFirst(terms), uri: termsUri });
  };

  onSelectPack = ({ id }) => this.setState({ selectedPackId: id });
  onToggleTermsAccepted = () => this.setState(({ termsAccepted }) => ({ termsAccepted: !termsAccepted }));

  renderFooter = () => {
    const { remoteConfigs: { hotline_default: hotlineNumber } } = this.props;
    const { selectedPackId, termsAccepted } = this.state;
    const { hotline: hotlineTitle, selectPack } = I18n.t('membershipPacks');

    return (
      <View style={styles.footerBox}>
        <HotlineButton bordering number={hotlineNumber} title={hotlineTitle} />
        <TermsCheckbox
          onOpenTerms={this.onOpenTerms}
          onSelect={this.onToggleTermsAccepted}
          selected={termsAccepted}
        />
        <PromoCodeBox
          onApplyPromoData={this.onApplyPromoData}
          onClearPromoData={this.onClearPromoData}
          ref={ref => this.promoCodeBox = ref}
        />
        <TextButton
          disabled={selectedPackId == null || !termsAccepted}
          onPress={this.navigatePackReceipt}
          title={selectPack}
        />
      </View>
    );
  };

  renderPackItem = (pack, index) => {
    const { selectedPackId } = this.state;
    const { id } = pack;
    
    return (
      <DataRow
        data={pack}
        key={`pack_item_${index}`}
        onSelect={this.onSelectPack}
        selected={selectedPackId === id}
      />
    );
  };

  renderRefreshControl = () => {
    const { membershipPacks: { loading } } = this.props;
    const { reloading } = this.state;

    return (
      <RefreshControl
        onRefresh={this.requestMembershipPacks}
        refreshing={!reloading && loading}
        tintColor="white"
      />
    );
  };

  render() {
    const { membershipPacks, reloading } = this.state;

    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        refreshControl={this.renderRefreshControl()}
        style={styles.container}
      >
        {reloading
          ? <LoadingPlaceholder color="#ffffff" />
          : _.map(membershipPacks, this.renderPackItem)
        }
        {this.renderFooter()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WEFIT,
  },
  footerBox: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
    padding: 16,
  },
});
