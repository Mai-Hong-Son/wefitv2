/**
 * @providesModule WeFit.Components.PurchaseReceipt.PromoCodeBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Locals
import PromoCodePopup from './PromoCodePopup';

export default class PromoCodeBox extends React.PureComponent {
  static propTypes = {
    onApplyPromoData: PropTypes.func.isRequired,
    onClearPromoData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onApplyPromoData = this.props.onApplyPromoData.bind(this);
    this.onClearPromoData = this.props.onClearPromoData.bind(this);
    this.state = { promoCode: null };
  }

  clear = () => {
    this.setState({ promoCode: null });
    this.codePopup.clear();
  };

  onApplyCode = promoData => {
    this.setState({ promoCode: _.trim(promoData.code) });
    this.onApplyPromoData(promoData);
  };
  
  onClearCode = () => {
    this.setState({ promoCode: null });
    this.onClearPromoData();
  };

  onOpenPopup = () => this.codePopup.show();

  render() {
    const { promoCode } = this.state;
    const { placeholder } = I18n.t('promoCodePopup');

    return (
      <View style={styles.container}>
        {/* <Text style={styles.instructions}>{instructions}</Text> */}
        <TouchableWithoutFeedback onPress={this.onOpenPopup}>
          <View style={styles.codeInputContainer}>
            <TextInput
              editable={false}
              placeholder={placeholder}
              placeholderTextColor={COLORS.ALL_C}
              style={styles.codeInput}
              underlineColorAndroid="transparent"
              value={promoCode}
            />
            <View style={SHEETS.absoluteFlex} />
          </View>
        </TouchableWithoutFeedback> 
        <PromoCodePopup
          innerRef={ref => this.codePopup = ref}
          onApplyCode={this.onApplyCode}
          onClearCode={this.onClearCode}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.stretched,
    marginBottom: 16,
  },
  codeInput: FontUtils.build({
    background: 'white',
    align: 'center',
    color: COLORS.WEFIT,
    size: 17,

    // Extra
    alignSelf: 'stretch',
    borderRadius: 4,
    height: 44,
  }),
  codeInputContainer: {
    alignSelf: 'stretch',
  },
});
