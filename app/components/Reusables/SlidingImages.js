/**
 * @providesModule WeFit.Components.Reusables.SlidingImages
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { Extensions } from '@onaclover/react-native-utils';
// import _ from 'lodash';
// import { DeviceUtils } from '@onaclover/react-native-utils';

const FADE_OUT_STOP = 1;
const CHANGE_CONTENT_STOP = 2;
const FADE_IN_STOP = 3;

export default class SlidingImages extends React.PureComponent {
  static propTypes = {
    autoChange: PropTypes.bool,
    children: PropTypes.arrayOf(PropTypes.element),
    delay: PropTypes.number,
    loop: PropTypes.bool,    
  };

  static defaultProps = {
    autoChange: false,    
    children: [],
    delay: 0,
    loop: false,    
  };

  constructor(props) {
    super(props);

    this.transitionOffset = new Animated.Value(0);
    this.state = {
      image: null,
      auto: this.props.autoChange,
    };
  }

  componentDidMount() {
    this.resetImages();
  }

  componentWillReceiveProps(nextProps) {
    this.changeImage(nextProps);
  }

  resetImages = () => {
    this.displayingIndex = 0;
    this.changeImage(this.props);
  };

  get animatedStyles() {
    const translateX = this.transitionOffset.interpolate({
      inputRange: [0, FADE_OUT_STOP, CHANGE_CONTENT_STOP, FADE_IN_STOP],
      outputRange: [0, -20, 20, 0],
    });

    const opacity = this.transitionOffset.interpolate({
      inputRange: [0, FADE_OUT_STOP, CHANGE_CONTENT_STOP, FADE_IN_STOP],
      outputRange: [1, 0, 0, 1],
    });

    return { opacity, transform: [{ translateX }], backgroundColor: 'transparent' };
  }

  changeImage = props => {
    const { loop, children } = props;

    if (this.displayingIndex >= children.length) {
      // Stop animations if loop is disabled
      if (!loop) return;
    }
    
    if (children.length <= 1) {
      this.setState({ auto: false });
    }

    const image = children[this.displayingIndex % children.length];
    this.setState({ image }, this.fadeIn);
    this.displayingIndex += 1;
  };

  fadeIn = () => {
    const { auto } = this.state;
    const callback = auto ? this.fadeOut : undefined;

    Animated.timing(this.transitionOffset, {
      duration: 500,
      toValue: FADE_IN_STOP,
    }).start(callback);
  };

  fadeOut = async () => {
    await Extensions.nap(this.props.delay);

    this.transitionOffset.setValue(0);

    Animated.timing(this.transitionOffset, {
      duration: 500,
      toValue: CHANGE_CONTENT_STOP,
    }).start(this.changeImage);
  };

  render() {
    const { image } = this.state;

    return (
      <Animated.View style={this.animatedStyles}>
        {image}
      </Animated.View>
    );
  }
}
