/**
 * @providesModule WeFit.Components.EmailAuth.ChangePassword
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';
import { PATTERNS } from 'app/constants/AppConstants';
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Locals
import InputBox, { inputModes } from '../InputBox';
import FlexibleBackground from '../FlexibleBackground';
import withConnect from './withConnect';

@withConnect
export default class ChangePassword extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('welcome.emailAuth.titles.changePassword'),
  });

  static propTypes = {
    changePassword: PropTypes.func.isRequired,
    changePasswordRequest: PropTypes.shape({
      error: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.changePassword = this.props.changePassword.bind(this);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { changePasswordRequest } = this.props;
    const { changePasswordRequest: nextChangePasswordRequest } = nextProps;

    if (changePasswordRequest !== nextChangePasswordRequest) {
      const { error, loading } = nextChangePasswordRequest;
      if (!loading && error == null) this.onSuccess();
    }
  }

  validateInputs = () => {
    const { text: password } = this.passwordInput;
    const { text: newPassword } = this.newPasswordInput;

    const {
      emptyNewPassword,
      emptyPassword,
      newPasswordTooShort,
      passwordTooShort,
      reusedPassword,
    } = I18n.t('validations');
    
    if (_.isEmpty(password)) return emptyPassword;
    if (password.length < PATTERNS.PASSWORD_LENGTH.MIN) return passwordTooShort;
    
    if (_.isEmpty(newPassword)) return emptyNewPassword;
    if (newPassword.length < PATTERNS.PASSWORD_LENGTH.MIN) return newPasswordTooShort;

    if (_.isEqual(password, newPassword)) return reusedPassword;

    return null;
  };

  onSuccess = () => {
    const { navigation: { goBack } } = this.props;
    goBack();
  };

  onSubmit = () => {
    const message = this.validateInputs();

    if (_.isEmpty(message)) {
      const { text: password } = this.passwordInput;
      const { text: newPassword } = this.newPasswordInput;
      this.changePassword({ newPassword, password });
      return;
    }

    this.showGlobalAlert({
      message, title: I18n.t('globalAlert.auth.changePassword'), type: GLOBAL_ALERT_TYPES.ERROR,
    });
  };

  render() {
    const { changePasswordRequest: { loading } } = this.props;
    const { buttons, instructions } = I18n.t('welcome.emailAuth');

    return (
      <FlexibleBackground>
        <Text style={styles.instructions}>{instructions.changePassword}</Text>
        <InputBox
          inputMode={inputModes.PASSWORD}
          onSubmitEditing={() => this.newPasswordInput.focus()}
          ref={ref => this.passwordInput = ref}
        />
        <InputBox
          inputMode={inputModes.NEW_PASSWORD}
          onSubmitEditing={this.onSubmit}
          ref={ref => this.newPasswordInput = ref}
        />
        <TextButton loading={loading} onPress={this.onSubmit} title={buttons.changePassword} />
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
