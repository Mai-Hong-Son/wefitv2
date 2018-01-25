/**
 * @providesModule WeFit.Components.Reusables.DropdownMenu
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated, Modal, Platform, StyleSheet, TouchableWithoutFeedback, UIManager, View,
  findNodeHandle,
} from 'react-native';
import Button from 'react-native-button';
import { DeviceUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

const ANIMATED_DURATION = 250;
const EDGE_MARGIN = 16;
const BOTTOM_UP = 'bottomUp';
const TOP_DOWN = 'topDown';

export const directions = { BOTTOM_UP, TOP_DOWN };

export default class DropdownMenu extends React.PureComponent {
  static propTypes = {
    backgroundColor: PropTypes.string,
    margin: PropTypes.number,
    onSelectOption: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    renderOption: PropTypes.func.isRequired,
  };

  static defaultProps = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 4,
  };

  constructor(props) {
    super(props);
    
    this.onSelectOption = this.props.onSelectOption.bind(this);
    this.renderOption = this.props.renderOption.bind(this);
    this.visibleOffset = new Animated.Value(0);

    this.state = {
      animationConfigs: { translateLimit: 0 },
      scrollStyles: {
        bottom: EDGE_MARGIN,
        left: EDGE_MARGIN,
        right: EDGE_MARGIN,
        top: EDGE_MARGIN,
        overflow: 'hidden',
      },
      visible: false,
    };
  }

  dismiss = () => this.toggleVisible(false);

  showForNode = (node, { direction } = {}) => {
    const nodeHandle = findNodeHandle(node);

    UIManager.measure(nodeHandle, (x_, y_, width, height, pageX, pageY) => {
      const states = this.buildScrollStates({ direction, height, pageX, pageY, width });
      this.setState(states, () => this.toggleVisible(true));
    });
  };
  
  toggleVisible = visible => {
    const duration = ANIMATED_DURATION;
    const toValue = visible ? 1 : 0;
    const timing = Animated.timing(this.visibleOffset, { duration, toValue });

    if (visible) this.setState({ visible: true }, () => timing.start());
    else timing.start(() => this.setState({ visible: false }));
  };

  buildScrollStates = ({ direction: presetDirection, height, pageX, pageY, width }) => {
    const { margin } = this.props;
    const { height: screenHeight, width: screenWidth } = DeviceUtils.screen;

    const autoDirection = pageY < screenHeight - pageY - height ? TOP_DOWN : BOTTOM_UP;
    const direction = presetDirection || autoDirection;

    const animationConfigs = {
      ...this.state.animationConfigs,
      direction,
      translation: direction === TOP_DOWN ? -(height + margin) : height + margin,
    };

    const newStyles = direction === TOP_DOWN
      ? { top: pageY + height + margin }
      : { bottom: screenHeight - pageY + margin };
    const scrollStyles = {
      ...this.state.scrollStyles,
      ...newStyles,
      left: pageX,
      right: screenWidth - pageX - width,
    };

    return { animationConfigs, scrollStyles };
  };

  onContentSizeChange = (width, height) => {
    const { margin } = this.props;
    const { animationConfigs: { direction }, scrollStyles } = this.state;
    const { height: screenHeight } = DeviceUtils.screen;
    
    if (direction === TOP_DOWN) {
      const { top: originTop } = scrollStyles;
      const bottom = Math.max(screenHeight - originTop - height, EDGE_MARGIN);
      const overflow = bottom > EDGE_MARGIN ? 'visible' : 'hidden';
      const top = Platform.select({ android: originTop - 20 - margin, ios: originTop });
      this.setState({ scrollStyles: { ...scrollStyles, bottom, overflow, top } });
    }
    
    if (direction === BOTTOM_UP) {
      const { bottom } = scrollStyles;
      const originTop = Math.max(screenHeight - bottom - height, EDGE_MARGIN);
      const overflow = originTop > EDGE_MARGIN ? 'visible' : 'hidden';
      const top = Platform.select({ android: originTop - 20 - margin, ios: originTop });
      this.setState({ scrollStyles: { ...scrollStyles, overflow, top } });
    }
  };

  onSelectRow = index => {
    this.onSelectOption(index);
    this.dismiss();
  };

  renderOptionRow = (data, index) => {
    const { options: { length } } = this.props;
    const containerStyle = index < length - 1 ? styles.hasSeparator : undefined;
    
    return (
      <Button
        containerStyle={containerStyle}
        key={`dropdown_option_${index}`}
        onPress={() => this.onSelectRow(data, index)}
      >
        {this.renderOption(data, index)}
      </Button>
    );
  };

  render() {
    const { backgroundColor, options } = this.props;
    const {
      animationConfigs: { translation },
      scrollStyles,
      visible,
    } = this.state;

    const opacity = this.visibleOffset;
    
    const translateY = this.visibleOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [translation, 0],
    });

    const contentStyles = [
      styles.scrollView,
      scrollStyles,
      { opacity },
      { transform: [{ translateY }] },
    ];

    return (
      <Modal animationType="none" onRequestClose={this.dismiss} transparent visible={visible}>
        <View style={styles.scrollContainer}>
          <TouchableWithoutFeedback onPress={this.dismiss}>
            <Animated.View style={[styles.background, { backgroundColor, opacity }]} />
          </TouchableWithoutFeedback>
          <Animated.ScrollView
            contentContainerStyle={styles.scrollContent}
            onContentSizeChange={this.onContentSizeChange}
            showsVerticalScrollIndicator={false}
            style={contentStyles}
          >
            {_.map(options, this.renderOptionRow)}
          </Animated.ScrollView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
  },
  background: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  scrollView: {
    borderRadius: 4,
    position: 'absolute',
  },
  scrollContent: {
    borderRadius: 4,
    backgroundColor: 'white',
  },

  hasSeparator: {
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
  },
});
