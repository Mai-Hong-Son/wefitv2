/**
 * @providesModule WeFit.Components.RedeemMembership.RedeemCodeInput
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, Text, TextInput, StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

// Components
import { HotlineButton } from 'app/components/Reusables/Buttons';

// Constants
import { PATTERNS } from 'app/constants/AppConstants';
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default class RedeemCodeInput extends React.PureComponent {
  static propTypes = {
    hotline: PropTypes.string,
    onChangeCode: PropTypes.func,
    onSubmitEditing: PropTypes.func,
  }
  
  static defaultProps = {
    hotline: null,
    onChangeCode: null,
    onSubmitEditing: null,
  }

  state = { code: null, disabledConfirm: false };

  onChangeText = text => {
    const { onChangeCode } = this.props;
    
    const valid = text.match(PATTERNS.ACTIVATION_CODE) != null;
    const newState = { code: valid ? text : null, disabledConfirm: !valid };
    this.setState(newState);
    onChangeCode && onChangeCode(newState);
  };

  onSubmitEditing = () => {
    const { onSubmitEditing } = this.props;
    onSubmitEditing && onSubmitEditing();
  };

  render() {
    const { hotline } = this.props;

    return (
      <View style={styles.container}>
        <Image source={require('app/assets/profile-icons/redeem-membership-big.png')} />
        <Text style={styles.instructions}>{I18n.t('redeemMembership.redeemCodeInput.title')}</Text>
        <TextInput
          autoCapitalize="characters"
          autoCorrect={false}
          autoFocus
          blurOnSubmit
          clearButtonMode="while-editing"
          keyboardType="ascii-capable"
          maxLength={6}
          onChangeText={this.onChangeText}
          onSubmitEditing={this.onSubmitEditing}
          placeholder={I18n.t('redeemMembership.redeemCodeInput.placeholder')}
          placeholderTextColor={COLORS.ALL_C}
          returnKeyType="send"
          selectTextOnFocus
          selectionColor={COLORS.PINK}
          style={styles.input}
          underlineColorAndroid="transparent"
        />
        <Text style={[styles.instructions, styles.instructionSmall]}>
          {I18n.t('redeemMembership.redeemCodeInput.instruction')}
        </Text>
        <HotlineButton bordering number={hotline} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
    marginBottom: 20,
  },

  instructions: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 17,

    // Extra
    marginVertical: 22,
  }),
  instructionSmall: {
    fontSize: 14,
  },
  
  input: FontUtils.build({
    align: 'center',
    background: 'white',
    color: COLORS.WEFIT,
    size: 17,

    // Extra
    alignSelf: 'stretch',
    borderRadius: 4,
    height: 44,
  }),
});
