/**
 * @providesModule WeFit.Components.Home.HeaderBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import LinearGradient from 'react-native-linear-gradient';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import HighlightText from 'app/components/Reusables/HighlightText';
import SlidingTexts from 'app/components/Reusables/SlidingTexts';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Models
import User from 'app/models/User';

// Locals
import withConnect from './withConnect';

const CONTAINER_HEIGHT = 180;
const PADDING_TOP = 50;

function getTopRouteIndex(props) {
  const { router: { routes } } = props;
  const [{ index }] = routes;
  return index;
}

@withConnect
export default class HeaderBox extends React.PureComponent {
  static propTypes = {
    router: PropTypes.shape({
      routes: PropTypes.arrayOf(
        PropTypes.shape({
          index: PropTypes.number,
        }).isRequired
      ).isRequired,
    }).isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const routeIndex = getTopRouteIndex(this.props);
    const nextRouteIndex = getTopRouteIndex(nextProps);

    if (routeIndex !== 0 && nextRouteIndex === 0)
      this.slidingTexts.fadeOut();
  }

  get containerStyles() {
    const { height: backgroundHeight, scrollOffset } = this.props;

    const height = scrollOffset.interpolate({
      inputRange: [-backgroundHeight, 0, backgroundHeight],
      outputRange: [
        CONTAINER_HEIGHT + backgroundHeight,
        CONTAINER_HEIGHT,
        CONTAINER_HEIGHT - backgroundHeight / 2,
      ],
    });
    
    const paddingTop = scrollOffset.interpolate({
      inputRange: [-backgroundHeight, 0, backgroundHeight],
      outputRange: [PADDING_TOP + backgroundHeight / 2, PADDING_TOP, PADDING_TOP],
    });
    
    const opacity = scrollOffset.interpolate({
      inputRange: [-backgroundHeight, 0, backgroundHeight],
      outputRange: [1, 1, 0.5],
    });

    return [styles.container, { height, opacity, paddingTop }];
  }

  render() {
    const { userData: { displayName } } = this.props;
    const greeting = `${_.compact([I18n.t('home.greeting'), displayName]).join(' ')},`;
    const quotes = _.map(I18n.t('quotes'), quote => `"${quote}"`);

    return (
      <Animated.View style={this.containerStyles}>
        <LinearGradient {...COLORS.BACKGROUND_GRADIENT} style={styles.background} />
        <View style={styles.content}>
          <HighlightText
            highlightWords={[displayName]}
            style={styles.greeting}
            template={greeting}
          />
          <SlidingTexts
            delay={300}
            loop
            presetContents={quotes}
            ref={ref => this.slidingTexts = ref}
            style={styles.quote}
          />
        </View>
      </Animated.View>
    );
  }
}

HeaderBox.propTypes = {
  height: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  scrollOffset: PropTypes.instanceOf(Animated.Value).isRequired,
  userData: PropTypes.instanceOf(User).isRequired,
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  background: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: -100,
  },
  content: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'flex-start',
  },
  greeting: {
    marginBottom: 5,
  },
  quote: FontUtils.build({
    color: 'white',
    size: 15,
    style: 'italic',
  }),
});
