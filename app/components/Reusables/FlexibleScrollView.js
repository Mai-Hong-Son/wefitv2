/**
 * @providesModule WeFit.Components.FlexibleScrollView
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated, Image, ScrollView, StyleSheet, TouchableWithoutFeedback, View, ViewPropTypes,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const DELTA_HEIGHT_TRIGGER = 20; // 20px of difference to show view more button
const VIEW_MORE_WIDTH = 60;

export default class FlexibleScrollView extends React.PureComponent {
  static propTypes = {
    ...ScrollView.propTypes,
    autoLock: PropTypes.bool,
    contentStyle: ViewPropTypes.style,
    reloadTrigger: PropTypes.any,
    shouldAwareKeyboard: PropTypes.bool,
  };

  static defaultProps = {
    ...ScrollView.defaultProps,
    autoLock: false,
    contentStyle: null,
    reloadTrigger: null,
    shouldAwareKeyboard: false,
    showsVerticalScrollIndicator: false,
  };

  constructor(props) {
    super(props);

    this.scrollOffset = new Animated.Value(0);
    this.state = { containerHeight: 0, contentHeight: 0 };
  }

  componentWillReceiveProps(nextProps) {
    const { reloadTrigger } = this.props;
    const { reloadTrigger: nextReloadTrigger } = nextProps;

    if (reloadTrigger !== nextReloadTrigger)
      this.setState({ containerHeight: 0, contentHeight: 0 });
  }

  get containerStyles() {
    const { containerHeight, contentHeight } = this.state;
    return (containerHeight > contentHeight) ? styles.container : null;
  }

  get contentStyles() {
    const { containerHeight, contentHeight } = this.state;
    return (containerHeight > contentHeight) ? styles.contentFullScreen : null;
  }

  get viewMoreStyles() {
    const { containerHeight, contentHeight } = this.state;
    if (containerHeight >= contentHeight) return null;

    const endPoint = contentHeight - containerHeight;

    const opacity = this.scrollOffset.interpolate({
      inputRange: [-0.01, 0, endPoint],
      outputRange: [1, 1, 0],
    });
    
    const right = this.scrollOffset.interpolate({
      inputRange: [-0.01, 0, endPoint],
      outputRange: [-2, -2, -VIEW_MORE_WIDTH],
    });

    return [styles.viewMoreButton, { opacity, right }];
  }

  onContainerLayout = event => {
    const { containerHeight } = this.state;
    if (containerHeight > 0) return;

    const { nativeEvent: { layout: { height } } } = event;
    this.setState({ containerHeight: height });
  };

  // Using sub view & onContentLayout to avoid multiple updates as with onContentSizeChange
  onContentLayout = event => {
    const { contentHeight } = this.state;
    if (contentHeight > 0) return;

    const { nativeEvent: { layout: { height } } } = event;
    this.setState({ contentHeight: height });
  };

  onViewMore = () => this.scrollView.scrollToEnd();

  render() {
    const { autoLock, children, contentStyle, shouldAwareKeyboard, ...passedProps } = this.props;
    const { containerHeight, contentHeight } = this.state;
    const ScrollComponent = shouldAwareKeyboard ? KeyboardAwareScrollView : ScrollView;

    return (
      <View style={styles.container}>
        <ScrollComponent
          {...passedProps}
          contentContainerStyle={this.containerStyles}
          onLayout={this.onContainerLayout}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollOffset } } }])}
          ref={ref => this.scrollView = ref}
          scrollEnabled={autoLock ? containerHeight < contentHeight : undefined}
          scrollEventThrottle={16}
        >
          <View onLayout={this.onContentLayout} style={[contentStyle, this.contentStyles]}>
            {children}
          </View>
        </ScrollComponent>
        {contentHeight - containerHeight > DELTA_HEIGHT_TRIGGER && (
          <TouchableWithoutFeedback onPress={this.onViewMore}>
            <Animated.View style={this.viewMoreStyles}>
              <Image source={require('app/assets/buttons/view-more.png')} />
            </Animated.View>
          </TouchableWithoutFeedback>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentFullScreen: {
    flex: 1,
    justifyContent: 'space-between',
  },
  viewMoreButton: {
    bottom: 20,
    position: 'absolute',
  },
});
