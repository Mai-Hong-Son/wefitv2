/**
 * @providesModule WeFit.Components.FriendsReferral
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ShareDialog } from 'react-native-fbsdk';
import I18n from 'react-native-i18n';
import { FontUtils, Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';
import HighlightText from 'app/components/Reusables/HighlightText';
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Models
import Referral from 'app/models/Referral';

// Utils
import { formatText } from 'app/utils';
import AlertUtils from 'app/utils/AlertUtils';

// Locals
import CreditBox from './CreditBox';
import ReferralCodeBox from './ReferralCodeBox';
import ReferralCodePopup from './ReferralCodePopup';
import withConnect from './withConnect';

@withConnect
export default class FriendsReferral extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('referral.title'),
  });

  static propTypes = {
    getUserReferrals: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
    userReferrals: PropTypes.shape({
      data: PropTypes.instanceOf(Referral),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    
    this.getUserReferrals = props.getUserReferrals.bind(this);
    this.showGlobalAlert = props.showGlobalAlert.bind(this);
  }

  componentDidMount() {
    this.getUserReferrals();
  }

  onCopyCode = () => {
    const { userReferrals: { data } } = this.props;
    if (data == null) return;

    const { code } = data;
    const { clipboard: { content, message }, title } = I18n.t('referral');
    AlertUtils.copyToClipboard(formatText(content, code));
    this.showGlobalAlert({ message, title, type: GLOBAL_ALERT_TYPES.SUCCESS });
  };

  onShareFacebook = async () => {
    const { userReferrals: { data } } = this.props;
    if (data == null) return;
    
    const { code } = data;

    const shareContent = {
      contentType: 'link',
      contentUrl: `https://referral.wefit.vn?referral_code=${code}`,
    };

    try {
      ShareDialog.setMode(Platform.select({ android: 'native', ios: 'webview' }));
      const canShow = await ShareDialog.canShow(shareContent);
      if (!canShow) return;

      const result = await ShareDialog.show(shareContent);
      Logger.debug(result);
    } catch (error) {
      Logger.debug(error);
    }
  };

  renderReferedBy = () => {
    const { userReferrals: { data } } = this.props;
    if (data == null) return null;

    const { name } = data.referred_by || {};
    const { referredBy } = I18n.t('referral');

    if (_.isEmpty(name)) return null;
    
    return (
      <HighlightText
        highlightWords={[name]}
        style={styles.referredByText}
        styleHighlight={styles.referredByHighlight}
        template={formatText(referredBy, name)}
      />
    );
  };

  renderReferralCodeButton = () => {
    const { userReferrals: { data: { code, referred_by: referredBy } = {} } } = this.props;
    if (!_.isEmpty(code) || !_.isEmpty(referredBy)) return null;

    const { enterReferralCode } = I18n.t('referral');
    
    return (
      <TextButton
        background={COLORS.PINK}
        onPress={() => this.referralCodePopup.show()}
        title={enterReferralCode}
      />
    );
  };

  renderContent = () => {
    const { userReferrals: { data, loading } } = this.props;
    if (loading) return null;

    const { code, credit, friends } = data || {};
    const { forCustomers, forNonCustomers } = I18n.t('referral.instructions');

    const refreshControl = (
      <RefreshControl onRefresh={this.getUserReferrals} refreshing={false} tintColor="white" />
    );
    
    return (
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="always"
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.referralInfoContainer}>
          {this.renderReferralCodeButton()}
          {this.renderReferedBy()}
        </View>
        <CreditBox credit={credit} friends={friends} />
        <ReferralCodeBox code={code} onCopy={this.onCopyCode} />
        <Text style={styles.instructions}>{_.isEmpty(code) ? forNonCustomers : forCustomers}</Text>
        <ReferralCodePopup innerRef={ref => this.referralCodePopup = ref} onApplyCode={this.getUserReferrals} />
      </ScrollView>
    );
  };

  render() {
    const { userReferrals: { loading } } = this.props;

    return (
      <View style={styles.container}>
        {loading
          ? <LoadingPlaceholder color="#ffffff" />
          : this.renderContent()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: COLORS.WEFIT,
  },

  referralInfoContainer: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginBottom: 50,
  },
  referredByText: {
    fontSize: 13,
    marginTop: 14,
  },
  referredByHighlight: {
    fontSize: 14,
  },

  content: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
  },

  instructions: FontUtils.build({
    align: 'center',
    color: 'white',
  }),
});
