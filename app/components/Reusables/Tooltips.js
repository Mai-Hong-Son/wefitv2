/**
 * @providesModule WeFit.Components.Reusables.Tooltips
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated, Modal, PixelRatio, StyleSheet, Text,
  TouchableWithoutFeedback, UIManager, View, findNodeHandle,
} from 'react-native';
import { DeviceUtils, FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

const ARROW_HEIGHT = 10;
const ARROW_WIDTH = 10;
const EDGE_MARGIN = 16;

export default class Tooltips extends React.PureComponent {
  static propTypes = {
    backgroundColor: PropTypes.string,
    maxWidth: PropTypes.number,
  };
  
  static defaultProps = {
    backgroundColor: 'transparent',
    maxWidth: PixelRatio.roundToNearestPixel(DeviceUtils.screen.width * 2 / 3),
  };

  constructor(props) {
    super(props);
    
    this.visibleOffset = new Animated.Value(0);
    this.state = {
      arrowStyles: {},
      message: false,
      messageBoxLayout: {},
      messageBoxStyles: {},
      showingNodeLayout: {},
      visible: false,
    };
  }

  get arrowStyles() {
    const { showingNodeLayout: { height, pageX, pageY, width } } = this.state;
    const { height: screenHeight } = DeviceUtils.screen;
    const showAbove = screenHeight - pageY >= pageY + height;

    const borderWidth = this.visibleOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [0, ARROW_HEIGHT],
    });

    const direction = showAbove
      ? { borderBottomColor: COLORS.WEFIT, borderBottomWidth: borderWidth }
      : { borderTopColor: COLORS.WEFIT, borderTopWidth: borderWidth };
    
    const positionY = showAbove
      ? { top: pageY + height }
      : { bottom: screenHeight - pageY };

    // const left = pageX + width / 2 - ARROW_WIDTH;
    const left = this.visibleOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [pageX + width / 2, pageX + width / 2 - ARROW_WIDTH],
    });
    
    const opacity = this.visibleOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const translateStart = showAbove ? -ARROW_HEIGHT : ARROW_HEIGHT;

    const translateY = this.visibleOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [translateStart, 0],
    });

    return [
      styles.arrow,
      {
        ...direction,
        ...positionY,
        left,
        opacity,
        borderLeftWidth: borderWidth,
        borderRightWidth: borderWidth,
        transform: [{ translateY }],
      },
    ];
  }

  get messageBoxStyles() {
    const {
      messageBoxLayout: { width: boxWidth = 0 },
      showingNodeLayout: { height, pageX, pageY, width },
    } = this.state;
    const { height: screenHeight, width: screenWidth } = DeviceUtils.screen;
    const showAbove = screenHeight - pageY >= pageY + height;

    const originLeft = PixelRatio.roundToNearestPixel(pageX + width / 2 - boxWidth / 2);

    const left = Math.min(
      Math.max(originLeft, EDGE_MARGIN),
      screenWidth - boxWidth - EDGE_MARGIN,
    );

    const position = showAbove
      ? { top: pageY + height + ARROW_HEIGHT }
      : { bottom: screenHeight - pageY + ARROW_HEIGHT };

    const opacity = this.visibleOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const translateStart = showAbove ? -ARROW_HEIGHT * 2 : ARROW_HEIGHT * 2;

    const translateY = this.visibleOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [translateStart, 0],
    });

    return [
      styles.messageBox,
      SHEETS.shadow,
      { ...position, left, opacity, transform: [{ translateY }] },
    ];
  }

  dismiss = () => this.toggleVisible(false);

  showForNode = (node, message) => {
    const nodeHandle = findNodeHandle(node);

    UIManager.measure(nodeHandle, (x_, y_, width, height, pageX, pageY) => {
      const showingNodeLayout = { height, pageX, pageY, width };
      const states = { message, showingNodeLayout, visible: true };
      this.setState(states, () => this.toggleVisible(true));
    });
  };
  
  toggleVisible = visible => {
    const timing = Animated.timing(this.visibleOffset, { duration: 200, toValue: visible ? 1 : 0 });
    
    if (visible) this.setState({ visible: true }, () => timing.start());
    else timing.start(() => this.setState({ visible: false }));
  };

  onMessageBoxLayout = event => {
    const { width } = event.nativeEvent.layout;
    this.setState({ messageBoxLayout: { width } });
  };

  render() {
    const { backgroundColor, maxWidth } = this.props;
    const { message, visible } = this.state;

    const backGroundStyles = { backgroundColor, opacity: this.visibleOffset };

    return (
      <Modal animationType="none" onRequestClose={this.dismiss} transparent visible={visible}>
        <TouchableWithoutFeedback onPress={this.dismiss}>
          <View style={styles.container}>
            <Animated.View style={[styles.background, backGroundStyles]} />
            <Animated.View style={this.arrowStyles} />
            <Animated.View onLayout={this.onMessageBoxLayout} style={this.messageBoxStyles}>
              <Text style={[styles.messageText, { maxWidth }]}>{message}</Text>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  messageBox: {
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.WEFIT,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    paddingHorizontal: EDGE_MARGIN,
    paddingVertical: 12,
  },
  messageText: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 14,
  }),

  arrow: {
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderLeftWidth: ARROW_WIDTH,
    borderRightColor: 'transparent',
    borderRightWidth: ARROW_WIDTH,
    height: 0,
    position: 'absolute',
    width: 0,
  },
});
