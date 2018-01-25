/**
 * @providesModule WeFit.Components.RedeemMembership.ActivationCodeInput
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Text, TextInput, StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

// Components
import { HotlineButton, TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { PATTERNS } from 'app/constants/AppConstants';
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default class ActivationCodeInput extends React.PureComponent {
  static propTypes = {
    hotline: PropTypes.string,
    loading: PropTypes.bool,
    onChangeCode: PropTypes.func,
    onSubmitEditing: PropTypes.func,
  }
  
  static defaultProps = {
    hotline: null,
    loading: false,
    onChangeCode: null,
    onSubmitEditing: null,
  }

  state = { code: null, disabledConfirm: true };

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
    const { hotline, loading } = this.props;
    const { disabledConfirm } = this.state;

    return (
      <View style={styles.container}>
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
          placeholder={I18n.t('redeemMembership.activationCodeInput.placeholder')}
          placeholderTextColor={COLORS.ALL_C}
          returnKeyType="send"
          selectTextOnFocus
          selectionColor={COLORS.PINK}
          style={styles.input}
          underlineColorAndroid="transparent"
        />
        <TextButton
          disabled={disabledConfirm}
          loading={loading}
          onPress={this.onSubmitEditing}
          title={I18n.t('redeemMembership.activationCodeInput.submit')}
        />
        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>
            {I18n.t('redeemMembership.activationCodeInput.instruction')}
          </Text>
        </View>
        <HotlineButton bordering number={hotline} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.stretched,
    backgroundColor: 'transparent',
    marginBottom: 90,
    marginTop: 10,
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
    marginBottom: 16,
  }),

  instructionContainer: {
    ...SHEETS.stretched,
    borderTopColor: COLORS.ALL_9,
    borderTopWidth: 1,
    paddingTop: 20,

    // Extra
    marginVertical: 20,
  },
  instruction: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 14,
  }),
});
