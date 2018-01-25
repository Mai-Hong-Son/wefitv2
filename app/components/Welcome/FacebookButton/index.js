/**
 * @providesModule WeFit.Components.Welcome.FacebookButton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { FACEBOOK_PERMISSIONS } from 'redux/constants';

// Locals
import withConnect from './withConnect';

@withConnect
export default class FacebookButton extends React.PureComponent {
  static propTypes = {
    connectFacebook: PropTypes.func.isRequired,
    facebookOauth: PropTypes.shape({
      accessToken: PropTypes.string,
      error: PropTypes.any,
      fromScene: PropTypes.string,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    forScene: PropTypes.string.isRequired,
    loginWithSocialAccount: PropTypes.func.isRequired,
    socialAuth: PropTypes.shape({
      error: PropTypes.any,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    style: null,
  };

  constructor(props) {
    super(props);

    this.connectFacebook = this.props.connectFacebook.bind(this);
    this.loginWithSocialAccount = this.props.loginWithSocialAccount.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { facebookOauth } = this.props;
    const { facebookOauth: prevFacebookOauth } = prevProps;

    if (facebookOauth !== prevFacebookOauth)
      this.requestSocialLogin();
  }

  facebookLoginHandler = async () => {
    try {
      const { isCancelled } = await LoginManager.logInWithReadPermissions(FACEBOOK_PERMISSIONS);

      if (isCancelled === true)
        throw new Error('Xác thực tài khoản Facebook không thành công, vui lòng thử lại');

      const accessTokenData = await AccessToken.getCurrentAccessToken();

      if (accessTokenData != null) {
        const accessToken = accessTokenData.accessToken.toString();
        if (accessToken != null)
          return accessToken;
      }

      throw new Error('Không thể truy cập dữ liệu Access-token từ Facebook, \
vui lòng liên hệ cskh@wefit.vn');
    } catch (error) { throw error; }
  };

  requestSocialLogin = () => {
    const { facebookOauth: { accessToken, fromScene }, forScene } = this.props;
    if (_.isEmpty(accessToken) || forScene !== fromScene) return;
    this.loginWithSocialAccount(accessToken);
  }

  onConnectFacebook = () => {
    const { forScene } = this.props;
    this.connectFacebook({ fromScene: forScene, loginHandler: this.facebookLoginHandler });
  };

  render() {
    const {
      facebookOauth: { loading: facebookLoading },
      socialAuth: { loading: socialLoading },
    } = this.props;

    return (
      <TextButton
        background={COLORS.FACEBOOK}
        loading={facebookLoading || socialLoading}
        onPress={this.onConnectFacebook}
        title={I18n.t('welcome.buttons.facebook')}
      />
    );
  }
}
