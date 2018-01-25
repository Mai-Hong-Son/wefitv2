/**
 * @providesModule WeFit.Components.EmailAuth.InputBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { PATTERNS } from 'app/constants/AppConstants';
import { COLORS, SHEETS } from 'app/constants/AppStyles';

const CODE = 'code';
const EMAIL = 'email';
const MIXED = 'mixed';
const NEW_PASSWORD = 'newPassword';
const PASSWORD = 'password';

function getKeyboardType(inputMode) {
  switch (inputMode) {
    case CODE: return 'ascii-capable';
    case EMAIL: return 'email-address';
    case MIXED: return 'email-address';
    case NEW_PASSWORD: return 'default';
    case PASSWORD: return 'default';
    default: return null;
  }
}

function getPlaceholder(inputMode) {
  const {
    email, mixed, newPassword, password, verificationCode,
  } = I18n.t('welcome.emailAuth.placeholders');

  const placeholersMapping = {
    [CODE]: verificationCode,
    [EMAIL]: email,
    [MIXED]: mixed,
    [NEW_PASSWORD]: newPassword,
    [PASSWORD]: password,
  };

  return placeholersMapping[inputMode];
}

export const inputModes = { CODE, EMAIL, MIXED, NEW_PASSWORD, PASSWORD };

export default class InputBox extends React.PureComponent {
  static propTypes = {
    ...TextInput.propTypes,
    defaultValue: PropTypes.string,
    inputMode: PropTypes.oneOf(_.values(inputModes)).isRequired,
    leftAlign: PropTypes.bool,
  };

  static defaultProps = {
    ...TextInput.defaultProps,
    autoCapitalize: 'none',
    autoCorrect: false,
    autoFocus: false,
    blurOnSubmit: true,
    defaultValue: null,
    leftAlign: false,
    placeholderTextColor: COLORS.ALL_C,
    returnKeyType: 'next',
    selectTextOnFocus: true,
    selectionColor: COLORS.PINK,
    underlineColorAndroid: 'transparent',
  };

  constructor(props) {
    super(props);

    const { defaultValue } = this.props;
    this.state = { passwordRevealed: false, text: defaultValue };
  }

  get text() { return this.state.text; }

  focus = () => this.textInput.focus();

  onConcealPassword = () => this.setState({ passwordRevealed: false });
  onRevealPassword = () => this.setState({ passwordRevealed: true });

  render() {
    const { inputMode, leftAlign, ...rest } = this.props;
    const { passwordRevealed } = this.state;

    const isPasswordMode = inputMode === PASSWORD || inputMode === NEW_PASSWORD;
    const textAlign = leftAlign ? 'left' : 'center';

    const inputProps = {
      ...rest,
      clearButtonMode: isPasswordMode ? 'never' : 'while-editing',
      keyboardType: getKeyboardType(inputMode),
      maxLength: isPasswordMode ? PATTERNS.PASSWORD_LENGTH.MAX : undefined,
      placeholder: getPlaceholder(inputMode),
      secureTextEntry: isPasswordMode && !passwordRevealed,
      style: [styles.input, { textAlign }],
    };

    return (
      <View style={styles.container}>
        <TextInput
          {...inputProps}
          onChangeText={text => this.setState({ text })}
          ref={ref => this.textInput = ref}
        />
        {isPasswordMode && (
          <Button
            containerStyle={styles.eyeButtonContainer}
            onPressIn={this.onRevealPassword}
            onPressOut={this.onConcealPassword}
          >
            <Image source={require('app/assets/icons/eye.png')} />
          </Button>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    backgroundColor: 'white',
    borderRadius: 4,
    height: 44,
    marginBottom: 16,
    paddingLeft: 16,
  },

  input: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,

    // Extra
    flex: 1,
  }),

  eyeButtonContainer: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    marginLeft: 8,
    position: 'absolute',
    right: 16,
    top: 0,
  },
});
