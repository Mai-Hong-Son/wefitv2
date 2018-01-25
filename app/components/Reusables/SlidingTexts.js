/**
 * @providesModule WeFit.Components.Reusables.SlidingTexts
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import { Extensions } from '@onaclover/react-native-utils';
import _ from 'lodash';

const FADE_OUT_STOP = 1;
const CHANGE_CONTENT_STOP = 2;
const FADE_IN_STOP = 3;

export default class SlidingTexts extends React.PureComponent {
  static propTypes = {
    autoChange: PropTypes.bool,
    delay: PropTypes.number,
    loop: PropTypes.bool,
    presetContents: PropTypes.arrayOf(PropTypes.string),
    style: Animated.Text.propTypes.style,
  };

  static defaultProps = {
    autoChange: false,
    delay: 0,
    loop: false,
    presetContents: [],
    style: null,
  };

  constructor(props) {
    super(props);

    this.transitionOffset = new Animated.Value(0);
    this.state = { content: null };
  }

  componentDidMount() {
    this.resetTexts();
  }

  componentDidUpdate(prevProps) {
    const { presetContents } = this.props;
    const { presetContents: prevPresetContents } = prevProps;

    if (presetContents.join() !== prevPresetContents.join())
      this.resetTexts();
  }

  get animatedStyles() {
    const translateX = this.transitionOffset.interpolate({
      inputRange: [0, FADE_OUT_STOP, CHANGE_CONTENT_STOP, FADE_IN_STOP],
      outputRange: [0, -20, 20, 0],
    });

    const opacity = this.transitionOffset.interpolate({
      inputRange: [0, FADE_OUT_STOP, CHANGE_CONTENT_STOP, FADE_IN_STOP],
      outputRange: [1, 0, 0, 1],
    });

    return { opacity, transform: [{ translateX }] };
  }

  resetTexts = () => {
    this.displayingIndex = 0;
    this.shuffledContents = [];
    this.changeText();
  };

  fadeOut = async () => {
    await Extensions.nap(this.props.delay);

    this.transitionOffset.setValue(0);

    Animated.timing(this.transitionOffset, {
      duration: 500,
      toValue: CHANGE_CONTENT_STOP,
    }).start(this.changeText);
  };

  changeText = () => {
    const { loop, presetContents } = this.props;
    this.displayingIndex += 1;

    if (this.displayingIndex >= this.shuffledContents.length) {
      // Stop animations if loop is disabled
      if (!loop) return;

      this.displayingIndex = 0;
      this.shuffledContents = _.shuffle(presetContents);
    }

    const content = this.shuffledContents[this.displayingIndex];
    this.setState({ content }, this.fadeIn);
  };

  fadeIn = () => {
    const { autoChange } = this.props;
    const callback = autoChange ? this.fadeOut : undefined;

    Animated.timing(this.transitionOffset, {
      duration: 250,
      toValue: FADE_IN_STOP,
    }).start(callback);
  };

  render() {
    const { style } = this.props;
    const { content } = this.state;

    return (
      <Animated.Text style={[style, this.animatedStyles]}>
        {content}
      </Animated.Text>
    );
  }
}
