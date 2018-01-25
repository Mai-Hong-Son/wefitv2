/**
 * @providesModule WeFit.Components.EmailAuth.SignUp
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
// import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';
import FacebookButton from 'app/components/Welcome/FacebookButton';

// Constants
import { PATTERNS } from 'app/constants/AppConstants';
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { AUTH_ROUTES } from 'app/constants/RouteNames';
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Locals
import InputBox, { inputModes } from '../InputBox';
import FlexibleBackground from '../FlexibleBackground';
import withConnect from './withConnect';

@withConnect
export default class SignUp extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('welcome.emailAuth.titles.signUp'),
  });

  static propTypes = {
    emailAuth: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    facebookOauth: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
    signUpWithEmail: PropTypes.func.isRequired,
    socialAuth: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
    this.signUpWithEmail = this.props.signUpWithEmail.bind(this);
  }

  validateInputs = () => {
    const { text: email } = this.emailInput;
    const { text: password } = this.passwordInput;

    const { emptyEmail, invalidEmail, emptyPassword, passwordTooShort } = I18n.t('validations');

    if (_.isEmpty(email)) return emptyEmail;
    if (email.match(PATTERNS.EMAIL) == null) return invalidEmail;
    
    if (_.isEmpty(password)) return emptyPassword;
    if (password.length < PATTERNS.PASSWORD_LENGTH.MIN) return passwordTooShort;

    return null;
  };

  onSubmitSignUp = () => {
    const message = this.validateInputs();

    if (_.isEmpty(message)) {
      const { text: email } = this.emailInput;
      const { text: password } = this.passwordInput;
      this.signUpWithEmail({ email, password });
      return;
    }

    this.showGlobalAlert({
      message, title: I18n.t('globalAlert.auth.loginEmail'), type: GLOBAL_ALERT_TYPES.ERROR,
    });
  };

  render() {
    const {
      emailAuth: { loading },
      facebookOauth: { loading: facebookLoading },
      socialAuth: { loading: socialLoading },
    } = this.props;

    const {
      buttons: { createAccount },
      instructions: { facebookHint },
    } = I18n.t('welcome.emailAuth');

    return (
      <FlexibleBackground>
        <InputBox
          inputMode={inputModes.EMAIL}
          leftAlign
          onSubmitEditing={() => this.passwordInput.focus()}
          ref={ref => this.emailInput = ref}
        />
        <InputBox
          inputMode={inputModes.PASSWORD}
          leftAlign
          onSubmitEditing={this.onSubmitSignUp}
          ref={ref => this.passwordInput = ref}
        />
        <TextButton
          disabled={facebookLoading || socialLoading}
          loading={loading}
          onPress={this.onSubmitSignUp}
          title={createAccount}
        />
        <View style={styles.footerBox}>
          <Text style={styles.facebookHint}>{facebookHint}</Text>
          <FacebookButton forScene={AUTH_ROUTES.EMAIL_SIGNUP} />
        </View>
      </FlexibleBackground>
    );
  }
}

const styles = StyleSheet.create({
  footerBox: {
    ...SHEETS.stretched,
    borderTopColor: COLORS.ALL_9,
    borderTopWidth: 1,
    marginTop: 20,
  },

  facebookHint: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 14,

    // Extra
    marginVertical: 20,
  }),
});
