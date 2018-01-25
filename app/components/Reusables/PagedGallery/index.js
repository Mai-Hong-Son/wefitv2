/**
 * @providesModule WeFit.Components.Reusables.PagedGallery
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, ScrollView, View, ViewPropTypes } from 'react-native';
import _ from 'lodash';

// Locals
import PaginationDot from './PaginationDot';
import styles from './styles';

export default class PagedGallery extends React.PureComponent {
  static propTypes = {
    ...ScrollView.propTypes,
    activeDotColor: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]).isRequired,
    defaultDotColor: PropTypes.string,
    dotStyle: ViewPropTypes.style,
    pageOffsetListener: PropTypes.func,
    paginationStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    ...ScrollView.defaultProps,
    activeDotColor: null,
    defaultDotColor: null,
    dotStyle: null,
    horizontal: true,
    overScrollMode: 'never',
    pageOffsetListener: null,
    paginationStyle: styles.paginationPosition,
    pagingEnabled: true,
    scrollEventThrottle: 16,
    showsHorizontalScrollIndicator: false,
  };

  constructor(props) {
    super(props);

    const { children, pageOffsetListener } = this.props;
    this.pagesCount = (children || []).length;
    this.pageOffset = new Animated.Value(0);
    this.pageWidth = 0;

    if (pageOffsetListener != null)
      this.pageOffset.addListener(pageOffsetListener);
  }

  componentWillUnmount() {
    this.pageOffset.removeAllListeners();
  }

  scrollToPage = ({ animated = true, page = 0 } = {}) => {
    this.scrollView.scrollTo({ animated, x: page * this.pageWidth, y: 0 });
  };

  onLayout = event => {
    const { nativeEvent: { layout: { width } } } = event;
    this.pageWidth = width;
  };

  onScroll = event => {
    const { nativeEvent: { contentOffset: { x: offsetX } } } = event;
    this.pageOffset.setValue(offsetX / this.pageWidth);
  };

  render() {
    const { activeDotColor, children, defaultDotColor, dotStyle, paginationStyle, ...scrollViewProps } = this.props;
    if (_.isEmpty(children) == null) return;

    return (
      <View>
        <ScrollView
          {...scrollViewProps}
          onLayout={this.onLayout}
          onScroll={this.onScroll}
          ref={ref => this.scrollView = ref}
        >
          {children}
        </ScrollView>
        <View style={[styles.paginationContainer, paginationStyle]}>
          {_.map(_.range(this.pagesCount), index => (
            <PaginationDot
              activeColor={activeDotColor}
              defaultColor={defaultDotColor}
              index={index}
              key={`pagination_dot_${index}`}
              pageOffset={this.pageOffset}
              style={dotStyle}
            />
          ))}
        </View>
      </View>
    );
  }
}
