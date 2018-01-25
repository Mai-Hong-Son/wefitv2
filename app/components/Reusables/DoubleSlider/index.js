/**
 * @providesModule WeFit.Components.DoubleSlider
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, PanResponder, View, ViewPropTypes } from 'react-native';
// import { Logger } from '@onaclover/react-native-utils';

// Locals
import styles from './styles';

/* eslint-disable no-underscore-dangle */

export default class DoubleSlider extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool,
    duration: PropTypes.number,
    highlightBarStyle: ViewPropTypes.style,
    highlightBarStyleDisabled: ViewPropTypes.style,
    leftBarStyle: ViewPropTypes.style,
    leftBarStyleDisabled: ViewPropTypes.style,
    onTracksSlide: PropTypes.func,
    onValuesChange: PropTypes.func,
    rightBarStyle: ViewPropTypes.style,
    rightBarStyleDisabled: ViewPropTypes.style,
    trackRadius: PropTypes.number,
    trackStyle: ViewPropTypes.style,
    trackStyleDisabled: ViewPropTypes.style,
  };
  
  static defaultProps = {
    disabled: false,
    duration: 500,
    highlightBarStyle: null,
    highlightBarStyleDisabled: null,
    leftBarStyle: null,
    leftBarStyleDisabled: null,
    onTracksSlide: null,
    onValuesChange: null,
    rightBarStyle: null,
    rightBarStyleDisabled: null,
    trackRadius: 10,
    trackStyle: null,
    trackStyleDisabled: null,
  };

  constructor(props) {
    super(props);

    const { onTracksSlide, onValuesChange } = this.props;
    this.onTracksSlide = onTracksSlide == null ? () => {} : onTracksSlide.bind(this);
    this.onValuesChange = onValuesChange == null ? () => {} : onValuesChange.bind(this);

    this.initValues();
  }

  shouldComponentUpdate(nextProps) {
    const { disabled } = this.props;
    const { disabled: nextDisabled } = nextProps;

    return disabled !== nextDisabled;
  }

  // Public methods
  clear = (animated = true) => this.moveTracks({ max: this.sliderWidth, min: 0 }, { animated });

  slideTracks = ({ from, to }, { animated = true, shouldCallback = true } = {}) => {
    const max = this.sliderWidth * to / 100;
    const min = this.sliderWidth * from / 100;
    this.moveTracks({ max, min }, { animated, shouldCallback });
  };

  // Private methods
  initValues = () => {
    const panConfigs = {
      onPanResponderGrant: this.onPanResponderGrant,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminationRequest: this.onPanResponderTerminationRequest,
      onStartShouldSetPanResponder: this.onStartShouldSetPanResponder,
    };
    
    this.maxTrackResponder = PanResponder.create({
      onPanResponderMove: event => this.onTrackMove(event, 'max'),
      ...panConfigs,
    });
    this.minTrackResponder = PanResponder.create({
      onPanResponderMove: event => this.onTrackMove(event, 'min'),
      ...panConfigs,
    });

    this.containerOffset = 0;
    this.sliderWidth = 0;

    this.containerHeight = new Animated.Value(0);
    this.containerPadding = new Animated.Value(0);

    this.leftBarFlex = new Animated.Value(0);
    this.highlightBarFlex = new Animated.Value(1);
    this.rightBarFlex = new Animated.Value(0);
    
    this.maxTrackOffset = new Animated.Value(1);
    this.minTrackOffset = new Animated.Value(0);
  };

  moveTracks = ({ max, min }, { animated = false, shouldCallback = true } = {}) => {
    if (max == null && min == null) return;

    const { trackRadius } = this.props;

    const { _value: maxOffset } = this.maxTrackOffset;
    const { _value: minOffset } = this.minTrackOffset;

    const newMax = max != null && max > minOffset + trackRadius && max <= this.sliderWidth
      ? max : maxOffset;
    const newMin = min != null && min >= 0 && min < maxOffset - trackRadius
      ? min : minOffset;

    this.scaleBars({ max: newMax, min: newMin }, { animated, shouldCallback });
  };

  scaleBars = ({ max, min }, { animated = false, shouldCallback = true } = {}) => {
    const { duration } = this.props;

    const callback = () => this.onValuesChange({
      max: Math.round(max * 100 / this.sliderWidth),
      min: Math.round(min * 100 / this.sliderWidth),
    });

    if (!animated) {
      this.maxTrackOffset.setValue(max);
      this.minTrackOffset.setValue(min);
      this.leftBarFlex.setValue(min);
      this.highlightBarFlex.setValue(max - min);
      this.rightBarFlex.setValue(this.sliderWidth - max);
      shouldCallback && callback();

      return;
    }

    const animations = [
      Animated.timing(this.maxTrackOffset, { duration, toValue: max }),
      Animated.timing(this.minTrackOffset, { duration, toValue: min }),
      Animated.timing(this.leftBarFlex, { duration, toValue: min }),
      Animated.timing(this.highlightBarFlex, { duration, toValue: max - min }),
      Animated.timing(this.rightBarFlex, { duration, toValue: this.sliderWidth - max }),
    ];

    Animated.parallel(animations).start(shouldCallback && callback);
  };

  onBarsLayout = ({ nativeEvent: { layout } }) => {
    if (this.sliderWidth > 0) return;
    this.sliderWidth = layout.width;
    if (this.sliderWidth > 0 && this.containerOffset > 0) this.clear(false);
  }

  onContainerLayout = ({ nativeEvent: { layout } }) => {
    if (this.containerOffset > 0) return;
    this.containerOffset = layout.x;
    if (this.sliderWidth > 0 && this.containerOffset > 0) this.clear(false);
  }

  onTrackMove = (event, trackKey) => {
    if (trackKey !== 'max' && trackKey !== 'min') return;

    const { trackRadius } = this.props;
    const { nativeEvent: { pageX } } = event;
    this.moveTracks({ [trackKey]: pageX - this.containerOffset - trackRadius });
  };

  onPanResponderGrant = () => this.onTracksSlide(true);
  onPanResponderRelease = () => this.onTracksSlide(false);
  onPanResponderTerminationRequest = () => true;

  onStartShouldSetPanResponder = () => {
    const { trackRadius } = this.props;
    const { _value: maxOffset } = this.maxTrackOffset;
    const { _value: minOffset } = this.minTrackOffset;
    return maxOffset > minOffset + trackRadius && maxOffset <= this.sliderWidth;
  };

  buildBackgroundBarStyles = ({ leftSide = true }) => {
    const {
      disabled,
      leftBarStyle,
      leftBarStyleDisabled,
      rightBarStyle,
      rightBarStyleDisabled,
    } = this.props;

    const disabledStyle = leftSide ? leftBarStyleDisabled : rightBarStyleDisabled;
    const flex = leftSide ? this.leftBarFlex : this.rightBarFlex;

    return [
      styles.slideBar,
      leftSide ? styles.leftBar : styles.rightBar,
      leftSide ? leftBarStyle : rightBarStyle,
      disabled && styles.slideBarDisabled,
      disabled && disabledStyle,
      { flex },
    ];
  };

  buildHighlightBarStyles = () => {
    const { disabled, highlightBarStyle, highlightBarStyleDisabled } = this.props;

    return [
      styles.slideBar,
      styles.highlightBar,
      highlightBarStyle,
      disabled && styles.slideBarDisabled,
      disabled && highlightBarStyleDisabled,
      { flex: this.highlightBarFlex },
    ];
  };
  
  buildTrackProps = ({ forMin = true }) => {
    const { disabled, trackStyle, trackStyleDisabled } = this.props;

    const { panHandlers } = forMin ? this.minTrackResponder : this.maxTrackResponder;

    const style = [
      styles.track,
      trackStyle,
      disabled && styles.trackDisabled,
      disabled && trackStyleDisabled,
      { left: forMin ? this.minTrackOffset : this.maxTrackOffset },
    ];

    return { style, ...panHandlers };
  };

  render() {
    const { disabled, trackRadius } = this.props;

    const containerStyles = [
      styles.container,
      { height: trackRadius * 2, paddingHorizontal: trackRadius },
    ];

    return (
      <View onLayout={this.onContainerLayout} style={containerStyles}>
        <View onLayout={this.onBarsLayout} style={styles.horizontalFlex}>
          <Animated.View style={this.buildBackgroundBarStyles({ leftSide: true })} />
          <Animated.View style={this.buildHighlightBarStyles()} />
          <Animated.View style={this.buildBackgroundBarStyles({ leftSide: false })} />
        </View>
        <Animated.View {...this.buildTrackProps({ forMin: true })} />
        <Animated.View {...this.buildTrackProps({ forMin: false })} />
        {disabled && <View style={styles.disabledMask} />}
      </View>
    );
  }
}

/* eslint-enable no-underscore-dangle */
