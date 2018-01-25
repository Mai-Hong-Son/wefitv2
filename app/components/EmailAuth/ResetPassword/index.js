/**
 * @providesModule WeFit.Components.EmailAuth.ResetPassword
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

// Locals
import InputBox, { inputModes } from '../InputBox';
import FlexibleBackground from '../FlexibleBackground';
import withConnect from './withConnect';

@withConnect
export default class ResetPassword extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('welcome.emailAuth.titles.resetPassword'),
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          oobCode: PropTypes.string,
        }),
      }),
    }).isRequired,
    resetPassword: PropTypes.func.isRequired,
    resetPasswordRequest: PropTypes.shape({
      error: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    router: PropTypes.shape({
      index: PropTypes.number.isRequired,
      routes: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.resetPassword = this.props.resetPassword.bind(this);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { resetPasswordRequest } = this.props;
    const { resetPasswordRequest: nextResetPasswordRequest } = nextProps;

    if (resetPasswordRequest !== nextResetPasswordRequest) {
      const { error, loading } = nextResetPasswordRequest;
      if (!loading && error == null) this.onSuccess();
    }
  }

  validateInputs = () => {
    const { text: newPassword } = this.newPasswordInput;

    const { emptyNewPassword, newPasswordTooShort } = I18n.t('validations');

    if (_.isEmpty(newPassword)) return emptyNewPassword;
    if (newPassword.length < PATTERNS.PASSWORD_LENGTH.MIN) return newPasswordTooShort;

    return null;
  };

  onSubmit = () => {
    const message = this.validateInputs();

    if (_.isEmpty(message)) {
      const { navigation: { state: { params: { oobCode } = {} } = {} } } = this.props;
      const { text: newPassword } = this.newPasswordInput;
      this.resetPassword({ newPassword, verificationCode: oobCode });
      return;
    }

    this.showGlobalAlert({
      message, title: I18n.t('globalAlert.resetPassword'), type: GLOBAL_ALERT_TYPES.ERROR,
    });
  };

  onSuccess = () => {
    const { resetPassword: message } = I18n.t('welcome.emailAuth.instructions');
    this.showGlobalAlert({
      message, title: I18n.t('globalAlert.resetPasswordSuccess'), type: GLOBAL_ALERT_TYPES.SUCCESS,
    });

    const { navigation: { goBack }, router: { index, routes } } = this.props;
    const { routes: currentAuthRoutes } = routes[index];

    const secondRoute = currentAuthRoutes[1];

    if (secondRoute == null)
      goBack();
    else {
      const { key } = secondRoute;
      goBack(key);
    }
  };

  render() {
    const { resetPasswordRequest: { loading } } = this.props;

    const { buttons: { submit }, instructions: { resetPassword } } = I18n.t('welcome.emailAuth');

    return (
      <FlexibleBackground>
        <Text style={styles.instructions}>{resetPassword}</Text>
        <InputBox
          inputMode={inputModes.NEW_PASSWORD}
          onSubmitEditing={this.onSubmit}
          ref={ref => this.newPasswordInput = ref}
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
