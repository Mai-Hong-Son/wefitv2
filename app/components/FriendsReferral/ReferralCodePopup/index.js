/**
 * @providesModule WeFit.Components.FriendsReferral.ReferralCodePopup
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';
import KeyboardAvoidPopup from 'app/components/Reusables/KeyboardAvoidPopup';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Models
import Referral from 'app/models/Referral';

// Utils
import { formatText } from 'app/utils';

// Locals
import withConnect from './withConnect';

@withConnect
export default class ReferralCodePopup extends React.PureComponent {
  static propTypes = {
    innerRef: PropTypes.func,
    linkReferralCode: PropTypes.func.isRequired,
    onApplyCode: PropTypes.func.isRequired,
    referralCodeLinking: PropTypes.shape({
      data: PropTypes.instanceOf(Referral),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
  };
  
  static defaultProps = {
    innerRef: null,
  };

  constructor(props) {
    super(props);

    this.linkReferralCode = props.linkReferralCode.bind(this);
    this.onApplyCode = props.onApplyCode.bind(this);
    this.showGlobalAlert = props.showGlobalAlert.bind(this);

    this.state = { referralCode: null };
  }

  componentDidMount = () => {
    const { innerRef } = this.props;
    innerRef && innerRef(this);
  };

  componentWillReceiveProps(nextProps) {
    const { referralCodeLinking } = this.props;
    const { referralCodeLinking: nextReferralCodeLinking } = nextProps;

    if (referralCodeLinking !== nextReferralCodeLinking) {
      const { data, loading } = nextReferralCodeLinking;
      if (!loading && data != null) this.applyCode(data);
    }
  }

  applyCode = referralData => {
    this.onApplyCode(referralData);
    this.popupContainer.dismiss();

    const { name } = referralData.referred_by;
    const { message, title } = I18n.t('referral.referralCodePopup');
    
    this.showGlobalAlert({
      title,
      message: formatText(message, name),
      type: GLOBAL_ALERT_TYPES.SUCCESS,
    });
  };

  show = () => this.popupContainer.show();
  
  onLinkCode = () => this.linkReferralCode(this.state.referralCode);

  render() {
    const { referralCodeLinking: { loading } } = this.props;
    const { referralCode } = this.state;
    const { apply, cancel, placeholder } = I18n.t('referral.referralCodePopup');

    return (
      <KeyboardAvoidPopup backgroundColor={COLORS.BLACK_OPAQUE_HALF} ref={ref => this.popupContainer = ref}>
        <View style={styles.container}>
          <TextInput
            autoCapitalize="characters"
            autoFocus
            blurOnSubmit={false}
            clearButtonMode="while-editing"
            onChangeText={text => this.setState({ referralCode: text })}
            onSubmitEditing={this.onLinkCode}
            placeholder={placeholder}
            placeholderTextColor={COLORS.ALL_C}
            style={styles.codeInput}
            underlineColorAndroid="transparent"
            value={referralCode}
          />
          <View style={SHEETS.horizontalFlex}>
            <TextButton
              background={COLORS.ALL_E}
              containerStyle={styles.buttonLeft}
              flexSize
              onPress={() => this.popupContainer.dismiss()}
              title={cancel}
              titleColor={COLORS.WEFIT}
            />
            <TextButton
              disabled={_.isEmpty(referralCode)}
              flexSize
              loading={loading}
              onPress={this.onLinkCode}
              title={apply}
            />
          </View>
        </View>
      </KeyboardAvoidPopup>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.stretched,
    backgroundColor: 'white',
    height: 144,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  codeInput: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 17,

    // Extra
    alignSelf: 'stretch',
    borderRadius: 4,
    borderColor: COLORS.ALL_9,
    borderWidth: 1,
    height: 44,
    marginBottom: 16,
  }),
  buttonLeft: {
    marginRight: 13,
  },
});
