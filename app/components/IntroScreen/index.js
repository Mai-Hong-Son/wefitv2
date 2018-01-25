/**
 * @providesModule WeFit.Components.IntroScreen
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import LinearGradient from 'react-native-linear-gradient';
import { DeviceUtils, FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { AnimatedButton } from 'app/components/Reusables/Buttons';
import PagedGallery from 'app/components/Reusables/PagedGallery';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { INTRO_ROUTES } from 'app/constants/RouteNames';

// Locals
import withConnect from './withConnect';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = DeviceUtils.screen;

const INTRO_ARTS = [
  require('app/assets/images/intro/slide-01.png'),
  require('app/assets/images/intro/slide-02.png'),
  require('app/assets/images/intro/slide-03.png'),
];

@withConnect
export default class IntroScreen extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    startTrial: PropTypes.func.isRequired,
    trialStart: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.startTrial = this.props.startTrial.bind(this);

    const pagesCount = INTRO_ARTS.length;
    this.animationsInputRange = [0, pagesCount - 2, pagesCount - 1, pagesCount];
    this.pageOffset = new Animated.Value(0);
  }

  buildButtonAnimations = ({ show } = {}) => {
    if (show !== true && show !== false) return {};

    const opacity = this.pageOffset.interpolate({
      inputRange: this.animationsInputRange,
      outputRange: show ? [0, 0, 1, 1] : [1, 1, 0, 0],
    });
    
    const translateY = this.pageOffset.interpolate({
      inputRange: this.animationsInputRange,
      outputRange: show ? [60, 60, 0, 0] : [0, 0, 60, 60],
    });

    const zIndex = this.pageOffset.interpolate({
      inputRange: this.animationsInputRange,
      outputRange: show ? [-1, -1, 1, 1] : [1, 1, -1, -1],
    });

    return { opacity, zIndex, transform: [{ translateY }] };
  };

  get buttonStyles() {
    const hideStyles = this.buildButtonAnimations({ show: false });
    const showStyles = this.buildButtonAnimations({ show: true });

    return {
      activateStyles: [styles.buttonContainer, styles.activateButton, showStyles],
      nextStyles: [styles.buttonContainer, styles.bottomButton, hideStyles],
      startStyles: [styles.buttonContainer, styles.bottomButton, showStyles],
    };
  }
  
  get footerBoxStyles() {
    const height = this.pageOffset.interpolate({
      inputRange: this.animationsInputRange,
      outputRange: [157, 157, 217, 217],
    });

    return [styles.footerBox, { height }];
  }

  pageOffsetListener = ({ value }) => this.pageOffset.setValue(value);

  onActivate = () => {
    const { navigation: { navigate } } = this.props;
    navigate(INTRO_ROUTES.ACTIVATION);
  };

  /* eslint-disable no-underscore-dangle */
  onNext = () => {
    const { _value: currentPage } = this.pageOffset;
    this.artsGallery.scrollToPage({ page: currentPage + 1 });
  };
  /* eslint-enable no-underscore-dangle */

  renderIntroArt = (artSource, index) => (
    <Image
      key={`intro_art_${index}`}
      resizeMode="contain"
      source={artSource}
      style={styles.introArtItem}
    />
  );

  renderIntroText = (text, index) => {
    const translateX = this.pageOffset.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [32, 0, -32],
    });

    const opacity = this.pageOffset.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0],
    });

    return (
      <Animated.View
        key={`intro_text_${index}`}
        style={[styles.introTextBox, { opacity, transform: [{ translateX }] }]}
      >
        <Text style={styles.introText}>{text}</Text>
      </Animated.View>
    );
  };

  render() {
    const { trialStart: { loading } } = this.props;
    const { activateStyles, nextStyles, startStyles } = this.buttonStyles;

    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#e82e81cc', COLORS.WEFIT]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 1 }}
          style={styles.backgroundGradient}
        >
          <PagedGallery
            bounces={false}
            pageOffsetListener={this.pageOffsetListener}
            paginationStyle={styles.paginationDots}
            ref={ref => this.artsGallery = ref}
          >
            {_.map(INTRO_ARTS, this.renderIntroArt)}
          </PagedGallery>
          <Animated.View style={this.footerBoxStyles}>
            <View style={SHEETS.stretched}>
              {_.map(I18n.t('welcome.intro.texts'), this.renderIntroText)}
            </View>
            <AnimatedButton
              animatedStyle={nextStyles}
              onPress={this.onNext}
              title={I18n.t('welcome.intro.buttons.next')}
            />
            <AnimatedButton
              animatedStyle={activateStyles}
              bordering
              darkTitle
              onPress={this.onActivate}
              title={I18n.t('welcome.intro.buttons.activateMembership')}
            />
            <AnimatedButton
              animatedStyle={startStyles}
              loading={loading}
              onPress={this.startTrial}
              title={I18n.t('welcome.intro.buttons.startTrial')}
            />
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: COLORS.WEFIT,
  },

  backgroundGradient: {
    flex: 1,
  },

  paginationDots: {
    top: 30,
  },
  introArtItem: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },

  footerBox: {
    ...SHEETS.shadow,
    alignItems: 'center',
    backgroundColor: 'white',
    bottom: 0,
    left: 0,
    justifyContent: 'flex-start',
    position: 'absolute',
    right: 0,
    padding: 16,
    paddingTop: 26,
  },
  introTextBox: {
    alignItems: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  introText: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 17,
  }),

  buttonContainer: {
    left: 16,
    position: 'absolute',
    right: 16,
  },
  activateButton: {
    bottom: 76,
  },
  bottomButton: {
    bottom: 16,
  },
});
