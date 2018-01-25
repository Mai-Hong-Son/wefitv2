/**
 * @providesModule WeFit.Components.MembershipPacksListing.PromoCodePopup
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
import PromoData from 'app/models/PromoData';

// Utils
import { formatText } from 'app/utils';

// Locals
import withConnect from './withConnect';

@withConnect
export default class PromoCodePopup extends React.PureComponent {
  static propTypes = {
    checkPromoCode: PropTypes.func.isRequired,
    innerRef: PropTypes.func,
    onApplyCode: PropTypes.func.isRequired,
    onClearCode: PropTypes.func,
    promoCodeChecking: PropTypes.shape({
      data: PropTypes.instanceOf(PromoData),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
  };
  
  static defaultProps = {
    innerRef: null,
    onClearCode: null,
  };

  constructor(props) {
    super(props);

    this.checkPromoCode = props.checkPromoCode.bind(this);
    this.onApplyCode = props.onApplyCode.bind(this);
    this.onClearCode = props.onClearCode == null ? () => { } : props.onClearCode.bind(this);
    this.showGlobalAlert = props.showGlobalAlert.bind(this);

    this.state = { promoCode: null };
  }

  componentDidMount = () => {
    const { innerRef } = this.props;
    innerRef && innerRef(this);
  };
  
  componentWillReceiveProps(nextProps) {
    const { promoCodeChecking } = this.props;
    const { promoCodeChecking: nextPromoCodeChecking } = nextProps;

    if (promoCodeChecking !== nextPromoCodeChecking) {
      const { data, loading } = nextPromoCodeChecking;
      if (!loading && data != null) this.applyCode(data);
    }
  }

  applyCode = promoData => {
    this.onApplyCode(promoData);
    this.popupContainer.dismiss();

    const { name } = promoData;
    const template = I18n.t('promoCodePopup.checkSuccess');
    this.showGlobalAlert({ title: formatText(template, name), type: GLOBAL_ALERT_TYPES.SUCCESS });
  };

  clear = () => this.setState({ promoCode: null });
  show = () => this.popupContainer.show();

  onChangeText = text => {
    this.setState({ promoCode: _.trim(text) });
    if (_.isEmpty(text)) this.onClearCode();
  };
  
  onCheckCode = () => this.checkPromoCode(this.state.promoCode);

  render() {
    const { promoCodeChecking: { loading } } = this.props;
    const { promoCode } = this.state;
    const { apply, cancel, placeholder } = I18n.t('promoCodePopup');

    return (
      <KeyboardAvoidPopup backgroundColor={COLORS.BLACK_OPAQUE_HALF} ref={ref => this.popupContainer = ref}>
        <View style={styles.container}>
          <TextInput
            autoCapitalize="characters"
            autoFocus
            blurOnSubmit={false}
            clearButtonMode="while-editing"
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onCheckCode}
            placeholder={placeholder}
            placeholderTextColor={COLORS.ALL_C}
            style={styles.codeInput}
            underlineColorAndroid="transparent"
            value={promoCode}
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
              disabled={_.isEmpty(promoCode)}
              flexSize
              loading={loading}
              onPress={this.onCheckCode}
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
