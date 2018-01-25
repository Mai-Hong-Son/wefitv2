/**
 * @providesModule WeFit.Components.Reusables.CollapsibleScrollView.CollapsibleSection
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, StyleSheet, View } from 'react-native';

// Locals
import HeaderBox from './HeaderBox';

export default class CollapsibleSection extends React.PureComponent {
  static propTypes = {
    animated: PropTypes.bool,
    children: PropTypes.element.isRequired,
    duration: PropTypes.number,
    index: PropTypes.number.isRequired,
    onToggle: PropTypes.func,
    renderPlaceholderOnly: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    animated: true,
    duration: 250,
    onToggle: null,
  };

  constructor(props) {
    super(props);
    
    this.state = { contentHeight: 0 };
    this.headerVisibleValue = new Animated.Value(-1);
    this.visibleValue = new Animated.Value(1);
  }

  componentWillReceiveProps(nextProps) {
    const { animated, duration, renderPlaceholderOnly, visible } = this.props;
    const { renderPlaceholderOnly: nextRenderPlaceholder, visible: nextVisible } = nextProps;

    if (renderPlaceholderOnly && !nextRenderPlaceholder)
      this.setState({ contentHeight: 0 });

    if (visible !== nextVisible) {
      const easing = Easing.quad;
      const toValue = nextVisible ? 1 : 0;

      if (!animated) {
        this.headerVisibleValue.setValue(toValue);
        this.visibleValue.setValue(toValue);
      }

      Animated.parallel([
        Animated.timing(this.headerVisibleValue, { toValue, duration, easing }),
        Animated.timing(this.visibleValue, { toValue, duration, easing }),
      ]).start(() => toValue === 1 && this.headerVisibleValue.setValue(-1));
    }
  }

  onContentLayout = event => {
    if (this.state.contentHeight > 0) return;

    const { height } = event.nativeEvent.layout;
    this.setState({ contentHeight: height });
  };

  render() {
    const { children } = this.props;
    const { contentHeight } = this.state;

    const height = this.visibleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, contentHeight],
    });

    return (
      <View>
        <HeaderBox {...this.props} visibleValue={this.headerVisibleValue} />
        <Animated.View
          onLayout={this.onContentLayout}
          style={[styles.content, contentHeight > 0 && { height }]}
        >
          {children}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    overflow: 'hidden',
  },
});
