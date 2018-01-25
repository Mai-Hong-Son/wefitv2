/**
 * @providesModule WeFit.Components.Welcome
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';
import LanguagesBox from 'app/components/Reusables/LanguagesBox';

// Constants
import { COLORS, SCALE_FACTOR, SHEETS } from 'app/constants/AppStyles';
import { AUTH_ROUTES } from 'app/constants/RouteNames';

// Locals
import FacebookButton from './FacebookButton';
import SellingPoints from './SellingPoints';
import withConnect from './withConnect';

@withConnect
export default class Welcome extends React.PureComponent {
  static propTypes = {
    changeLanguage: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.changeLanguage = this.props.changeLanguage.bind(this);
  }

  onPressEmailLogin = () => {
    const { navigation: { navigate } } = this.props;
    navigate(AUTH_ROUTES.EMAIL_LOGIN);
  }

  render() {
    const { language } = this.props;

    return (
      <View style={styles.container}>
        <LinearGradient
          {...COLORS.BACKGROUND_GRADIENT}
          end={{ x: 0, y: 0 }}
          start={{ x: 1, y: 1 }}
          style={SHEETS.absoluteFlex}
        /> 
        <Image source={require('app/assets/images/welcome-artwork.png')} style={styles.artwork} />
        <LanguagesBox
          containerStyle={styles.languageButton}
          currentLanguage={language}
          formatDropdownName={({ code }) => _.capitalize(code.split('-')[0])}
          onDataChanged={this.changeLanguage}
        />
        <View style={styles.buttonsContainer}>
          <SellingPoints />
          <FacebookButton forScene={AUTH_ROUTES.WELCOME} />
          <TextButton
            containerStyle={styles.emailAuthButton}
            onPress={this.onPressEmailLogin}
            title={I18n.t('welcome.buttons.email')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WEFIT,
    flex: 1,
    justifyContent: 'flex-end',
  },

  artwork: {
    bottom: 190,
    position: 'absolute',
    height: 438 * SCALE_FACTOR,
    left: -54 * SCALE_FACTOR,
    resizeMode: 'cover',
    width: 500 * SCALE_FACTOR,
  },

  languageButton: {
    right: 0,
    position: 'absolute',
    top: Platform.select({ android: 20, ios: 16 }),
    width: Platform.select({ android: 95, ios: 90 }),
  },

  buttonsContainer: {
    ...SHEETS.stretched,
    margin: 16,
  },
  emailAuthButton: {
    marginTop: 16,
  },
});
