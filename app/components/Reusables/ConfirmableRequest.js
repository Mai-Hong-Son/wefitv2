/**
 * @providesModule WeFit.Components.Reusables.ConfirmableRequest
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated, BackHandler, Image, ScrollView, StatusBar, StyleSheet, View,
} from 'react-native';
import { DeviceUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { AnimatedButton } from 'app/components/Reusables/Buttons';

// Constants
import { COLORS, HEADER_HEIGHT, NAVIGATION, SCALE_FACTOR, SHEETS } from 'app/constants/AppStyles';

const { width: SCREEN_WIDTH } = DeviceUtils.screen;
const BUTTON_HEIGHT = 44;
const BUTTON_MARGIN = 16;

export function getNavigationOptions() {
  return ({ navigation: { state: { params } } }) => {
    const { headerHidden } = params || {};
    const headerProps = headerHidden === true ? { header: null } : {};

    return {
      ...headerProps,
      gesturesEnabled: !headerHidden,
      headerStyle: NAVIGATION.transparentHeader,
    };
  };
}

export function popToScreen({ goBack, navigate, routeName, routes }) {
  // Find the key of 2nd scene on stack to pop to root sceen
  const [first, { key } = {}] = routes;

  // No screen key found, just go back
  if (_.isEmpty(key)) {
    goBack();
    return;
  }
  
  // Go back from current screen key
  goBack(key);

  // If a routeName provided, navigate to that screen after going back
  if (!_.isEmpty(routeName)) {
    const { index: currentIndex, routes: tabRoutes } = first;
    const mySessionsIndex = _.findIndex(tabRoutes, { routeName });
    
    if (mySessionsIndex !== currentIndex)
      navigate(routeName);
  }
}

export default class ConfirmableRequest extends React.PureComponent {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    confirmTitle: PropTypes.string,
    disabledConfirm: PropTypes.bool,
    finishTitle: PropTypes.string.isRequired,
    finished: PropTypes.bool,
    loadingConfirm: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onFinish: PropTypes.func.isRequired,
  };
  
  static defaultProps = {
    confirmTitle: null,
    disabledConfirm: false,
    finished: false,
    loadingConfirm: false,
  };

  constructor(props) {
    super(props);

    this.onConfirm = this.props.onConfirm.bind(this);
    this.onFinish = this.props.onFinish.bind(this);

    /**
     * 
     * Offset for scroll animations:
     *  - 0: showing session info
     *  - 1: fade-out session info & fade-in reserve success message
     */
    this.transitionOffset = new Animated.Value(0);

    this.state = { allowsBack: true };
  }

  componentDidMount() {
    BackHandler.addEventListener('backPress', () => !this.state.allowsBack);
  }

  componentWillReceiveProps(nextProps) {
    const { finished } = this.props;
    const { finished: nextFinished } = nextProps;

    if (!finished && nextFinished)
      this.toggleTransition(true);
  }

  componentWillUnmount() {
    StatusBar.setBarStyle('light-content', true);
  }

  buildBottomButtonStyles = showsFirst => {
    const secondBottom = -BUTTON_MARGIN - BUTTON_HEIGHT;

    const bottom = this.transitionOffset.interpolate({
      inputRange: [-0.01, 0, 1, 1.01],
      outputRange: showsFirst
        ? [BUTTON_MARGIN, BUTTON_MARGIN, secondBottom, secondBottom]
        : [secondBottom, secondBottom, BUTTON_MARGIN, BUTTON_MARGIN],
    });
    
    const opacity = this.transitionOffset.interpolate({
      inputRange: [0, 1],
      outputRange: showsFirst ? [1, 0] : [0, 1],
    });

    return [styles.bottomButton, { bottom, opacity }];
  };

  toggleTransition = finished => {
    Animated.timing(this.transitionOffset, { duration: 300, toValue: finished ? 1 : 0 }).start();
    StatusBar.setBarStyle(finished ? 'dark-content' : 'light-content', true);
    this.setState({ allowsBack: !finished });
  };

  renderContentPages = () => {
    // Strip 2 first children to show
    const pages = _.slice(this.props.children, 0, 2);

    const marginLeft = this.transitionOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -SCREEN_WIDTH],
    });

    return (
      <Animated.View style={[styles.contentPagesContainer, { marginLeft }]}>
        {_.map(pages, (child, index) => (
          <View key={`confirmable_page_${index}`} style={styles.pageContainer}>
            {child}
          </View>
        ))}
      </Animated.View>
    );
  };

  renderContent = () => {
    const backgroundColor = this.transitionOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.WEFIT, 'white'],
    });

    return (
      <ScrollView scrollEnabled={false}>
        <Animated.View style={[styles.content, { backgroundColor }]}>
          {this.renderContentPages()}
          <Image source={require('app/assets/images/footer-art.png')} style={styles.footerArt} />
        </Animated.View>
      </ScrollView>
    );
  };

  render() {
    const { confirmTitle, disabledConfirm, finishTitle, loadingConfirm } = this.props;

    return (
      <View style={styles.container}>
        {this.renderContent()}
        {!_.isEmpty(confirmTitle) && (
          <AnimatedButton
            animatedStyle={this.buildBottomButtonStyles(true)}
            disabled={disabledConfirm}
            loading={loadingConfirm}
            onPress={this.onConfirm}
            title={confirmTitle}
          />
        )}
        <AnimatedButton
          animatedStyle={this.buildBottomButtonStyles(false)}
          onPress={this.onFinish}
          title={finishTitle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: COLORS.WEFIT,
  },

  content: {
    paddingTop: HEADER_HEIGHT + 36,
  },
  contentPagesContainer: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 2,
  },
  pageContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    width: SCREEN_WIDTH,
  },

  footerArt: {
    marginTop: 5,
    height: 250 * SCALE_FACTOR,
    resizeMode: 'cover',
    width: SCREEN_WIDTH,
  },

  bottomButton: {
    ...SHEETS.stretched,
    position: 'absolute',
    bottom: BUTTON_MARGIN,
    left: BUTTON_MARGIN,
    right: BUTTON_MARGIN,
  },
});
