/**
 * @providesModule WeFit.Components.Tutorial
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
// import LinearGradient from 'react-native-linear-gradient';
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
  require('app/assets/images/tutorial/art-01.png'),
  require('app/assets/images/tutorial/art-02.png'),
  require('app/assets/images/tutorial/art-03.png'),
];

const INTRO_ART_HEIGHTS = [241, 225, 234];

@withConnect
export default class Tutorial extends React.PureComponent {
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
      outputRange: [60, 60, 120, 120],
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

  renderIntroArt = (artSource, index) => {
    const { [index]: height } = INTRO_ART_HEIGHTS;
    const { [index]: { big, small } } = I18n.t('welcome.tutorials');

    return (
      <View key={`intro_art_${index}`} style={styles.introArtItemContainer}>
        <Image resizeMode="contain" source={artSource} style={[styles.introArtItem, { height }]} />
        <Text style={styles.smallText}>{small}</Text>
        <Text style={styles.bigText}>{big}</Text>
      </View>
    );
  };

  render() {
    const { trialStart: { loading } } = this.props;
    const { activateStyles, nextStyles, startStyles } = this.buttonStyles;

    const { buttons: { next, activateMembership, startTrial } } = I18n.t('welcome.intro');

    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('app/assets/images/tutorial/background.png')}
          style={styles.backgroundImage}
        >
          <PagedGallery
            activeDotColor={COLORS.PINK}
            bounces={false}
            defaultDotColor="white"
            dotStyle={styles.paginationDot}
            pageOffsetListener={this.pageOffsetListener}
            paginationStyle={styles.pagination}
            ref={ref => this.artsGallery = ref}
          >
            {_.map(INTRO_ARTS, this.renderIntroArt)}
          </PagedGallery>
          <Animated.View style={this.footerBoxStyles}>
            <AnimatedButton animatedStyle={nextStyles} onPress={this.onNext} title={next} />
            <AnimatedButton
              animatedStyle={activateStyles}
              bordering
              onPress={this.onActivate}
              title={activateMembership}
            />
            <AnimatedButton
              animatedStyle={startStyles}
              loading={loading}
              onPress={this.startTrial}
              title={startTrial}
            />
          </Animated.View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: COLORS.WEFIT,
  },

  backgroundImage: {
    flex: 1,
  },

  pagination: {
    bottom: 140,
  },
  paginationDot: {
    borderRadius: 5,
    height: 10,
    marginHorizontal: 5,
    width: 10,
  },
  introArtItemContainer: {
    alignItems: 'center',
    height: 480 / 667 * SCREEN_HEIGHT,
    justifyContent: 'flex-end',
    width: SCREEN_WIDTH,
  },
  introArtItem: {
    marginBottom: 20,
    width: 205,
  },
  smallText: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 20,
    weight: 'medium',

    // Extra
    marginBottom: 16,
  }),
  bigText: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 30,
    weight: 'bold',
  }),

  footerBox: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    justifyContent: 'flex-start',
    position: 'absolute',
    right: 0,
    padding: 16,
    paddingTop: 0,
  },

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
