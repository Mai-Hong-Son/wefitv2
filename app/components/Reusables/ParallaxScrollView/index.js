/**
 * @providesModule WeFit.Components.Reusables.ParallaxScrollView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, ScrollView, View, ViewPropTypes } from 'react-native';

// Constants
import { PARALLAX_HEIGHT, SHEETS } from 'app/constants/AppStyles';

// Locals
import ParallaxBackground from './ParallaxBackground';
import ParallaxHeader from './ParallaxHeader';

export default class ParallaxScrollView extends React.PureComponent {
  static propTypes = {
    ...ScrollView.propTypes,
    backgroundHeight: PropTypes.number,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    containerStyle: ViewPropTypes.style,
    contentStyle: ViewPropTypes.style,
    maskColor: PropTypes.string,
    onScroll: PropTypes.func,
    parallaxHeight: PropTypes.number,
    renderBackground: PropTypes.func,
    renderHeader: PropTypes.func,
    scalableHeader: PropTypes.bool,
    touchableBackground: PropTypes.bool,
  };
  
  static defaultProps = {
    ...ScrollView.defaultProps,
    backgroundHeight: PARALLAX_HEIGHT,
    containerStyle: null,
    contentStyle: null,
    maskColor: '#0004',
    onScroll: null,
    parallaxHeight: PARALLAX_HEIGHT,
    renderBackground: null,
    renderHeader: null,
    scalableHeader: false,
    scrollEventThrottle: 16,
    touchableBackground: false,
  };

  constructor(props) {
    super(props);
    this.state = { overlayBackground: this.props.touchableBackground };
    this.scrollOffset = new Animated.Value(0);
  }

  get zIndexStyle() {
    const { overlayBackground } = this.state;
    return {
      elevation: overlayBackground ? 0 : 1,
      zIndex: overlayBackground ? -999 : 999,
    };
  }

  onScroll = event => {
    const { nativeEvent: { contentOffset: { y: offsetY } } } = event;
    this.scrollOffset.setValue(offsetY);

    // In case of touchableBackground enabled,
    // toggle overlayBackground flag to bring ParallaxBackground forward or backward
    if (this.props.touchableBackground)
      this.setState({ overlayBackground: offsetY === 0 });

    const { onScroll } = this.props;
    onScroll && onScroll(offsetY);
  };

  render() {
    const {
      backgroundHeight,
      children,
      containerStyle,
      contentStyle,
      maskColor,
      parallaxHeight,
      renderBackground,
      renderHeader,
      scalableHeader,
    } = this.props;

    const header = scalableHeader ? (
      <ParallaxHeader height={parallaxHeight} scrollOffset={this.scrollOffset}>
        {renderHeader != null && renderHeader(this.scrollOffset)}
      </ParallaxHeader>
    ) : (
      <View style={{ height: parallaxHeight }}>
        {renderHeader != null && renderHeader(this.scrollOffset)}
      </View>
    );

    const content = contentStyle == null ? children : (
      <View style={contentStyle}>
        {children}
      </View>
    );

    return (
      <View style={[SHEETS.container, containerStyle]}>
        {backgroundHeight > 0 && (
          <ParallaxBackground
            height={backgroundHeight}
            maskColor={maskColor}
            scrollOffset={this.scrollOffset}
          >
            {renderBackground != null && renderBackground(this.scrollOffset)}
          </ParallaxBackground>
        )}
        <ScrollView
          {...this.props}
          onScroll={this.onScroll}
          overScrollMode="never"
          scrollEventThrottle={16}
          style={this.zIndexStyle}
        >
          {parallaxHeight > 0 && header}
          {content}
        </ScrollView>
      </View>
    );
  }
}
