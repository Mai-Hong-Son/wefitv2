/**
 * @providesModule WeFit.Components.EmailAuth.Login
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { LinkButton, TextButton } from 'app/components/Reusables/Buttons';

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
export default class Login extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('welcome.emailAuth.titles.login'),
  });

  static propTypes = {
    emailAuth: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    loginWithEmail: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.loginWithEmail = this.props.loginWithEmail.bind(this);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
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

  onForgotPassword = () => {
    const { navigation: { navigate } } = this.props;
    navigate(AUTH_ROUTES.FORGOT_PASSWORD);
  };

  onSubmitLogin = () => {
    const message = this.validateInputs();

    if (_.isEmpty(message)) {
      const { text: email } = this.emailInput;
      const { text: password } = this.passwordInput;
      this.loginWithEmail({ email, password });
      return;
    }

    this.showGlobalAlert({
      message, title: I18n.t('globalAlert.auth.loginEmail'), type: GLOBAL_ALERT_TYPES.ERROR,
    });
  };

  onSignUp = () => {
    const { navigation: { navigate } } = this.props;
    navigate(AUTH_ROUTES.EMAIL_SIGNUP);
  };

  render() {
    const { emailAuth: { loading } } = this.props;

    const {
      buttons: { login, forgotPassword, register },
      instructions: { notRegistered },
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
          onSubmitEditing={this.onSubmitLogin}
          ref={ref => this.passwordInput = ref}
        />
        <TextButton loading={loading} onPress={this.onSubmitLogin} title={login} />
        <LinkButton
          containerStyle={styles.forgotPasswordLink}
          onPress={this.onForgotPassword}
          title={forgotPassword}
        />
        <View style={styles.footerBox}>
          <Text style={styles.notRegistered}>{notRegistered}</Text>
          <LinkButton onPress={this.onSignUp} title={register} />
        </View>
      </FlexibleBackground>
    );
  }
}

const styles = StyleSheet.create({
  forgotPasswordLink: {
    marginTop: 20,
  },

  footerBox: {
    ...SHEETS.horizontalFlex,
    borderTopColor: COLORS.ALL_9,
    borderTopWidth: 1,
    marginTop: 20,
    paddingTop: 20,
  },

  notRegistered: FontUtils.build({
    color: 'white',
    size: 14,

    // Extra
    marginRight: 5,
  }),
});
