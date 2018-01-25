/**
 * @providesModule WeFit.Components.EmailAuth.ForgotPassword
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { PATTERNS } from 'app/constants/AppConstants';
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Utils
import { formatText } from 'app/utils';

// Locals
import InputBox, { inputModes } from '../InputBox';
import FlexibleBackground from '../FlexibleBackground';
import withConnect from './withConnect';

@withConnect
export default class ForgotPassword extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('welcome.emailAuth.titles.forgotPassword'),
  });

  static propTypes = {
    forgotPassword: PropTypes.func.isRequired,
    forgotPasswordRequest: PropTypes.shape({
      error: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.forgotPassword = this.props.forgotPassword.bind(this);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { forgotPasswordRequest } = this.props;
    const { forgotPasswordRequest: nextForgotPasswordRequest } = nextProps;

    if (forgotPasswordRequest !== nextForgotPasswordRequest) {
      const { error, loading } = nextForgotPasswordRequest;
      if (!loading && error == null) this.onSuccess();
    }
  }

  validateInputs = () => {
    const { text: email } = this.emailInput;

    const { emptyEmail, invalidEmail } = I18n.t('validations');

    if (_.isEmpty(email)) return emptyEmail;
    if (email.match(PATTERNS.EMAIL) == null) return invalidEmail;

    return null;
  };

  onSubmit = () => {
    const message = this.validateInputs();

    if (_.isEmpty(message)) {
      const { text: email } = this.emailInput;
      this.forgotPassword(email);
      return;
    }

    this.showGlobalAlert({
      message, title: I18n.t('globalAlert.forgotPassword'), type: GLOBAL_ALERT_TYPES.ERROR,
    });
  };

  onSuccess = () => {
    const { text: email } = this.emailInput;
    const { checkEmail } = I18n.t('welcome.emailAuth.instructions');
    const message = formatText(checkEmail, email);
    this.showGlobalAlert({
      message, title: I18n.t('globalAlert.forgotPassword'), type: GLOBAL_ALERT_TYPES.INFO,
    });
  };

  render() {
    const { forgotPasswordRequest: { loading } } = this.props;
    const { buttons: { submit }, instructions: { forgotPassword } } = I18n.t('welcome.emailAuth');

    return (
      <FlexibleBackground>
        <Text style={styles.instructions}>{forgotPassword}</Text>
        <InputBox
          inputMode={inputModes.EMAIL}
          onSubmitEditing={this.onSubmit}
          ref={ref => this.emailInput = ref}
        />
        <TextButton loading={loading} onPress={this.onSubmit} title={submit} />
      </FlexibleBackground>
    );
  }
}

const styles = StyleSheet.create({
  instructions: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 14,

    // Extra
    marginBottom: 20,
  }),
});
