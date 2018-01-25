/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.GalleryBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';
import { DeviceUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import FadedMask from 'app/components/Reusables/FadedMask';
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';
import PagedGallery from 'app/components/Reusables/PagedGallery';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import GalleryItem, { galleryTypes } from 'app/models/GalleryItem';

// Locals
import GalleryPage from './GalleryPage';
import PlayButton from './PlayButton';

export default class GalleryBox extends React.PureComponent {
  static propTypes = {
    height: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.instanceOf(GalleryItem)).isRequired,
    maskColor: PropTypes.string.isRequired,
    placeholderImage: PropTypes.string,
    scrollOffset: PropTypes.instanceOf(Animated.Value).isRequired,
  };

  static defaultProps = {
    items: [],
    maskColor: COLORS.WEFIT,
    placeholderImage: null,
  };

  state = { playingVideoIndex: -1, showsPlaceholderImageLoading: true };

  onRevokePlaying = () => this.setState({ playingVideoIndex: -1 });

  renderPlaceholderImage = () => {
    const { height, maskColor, placeholderImage, scrollOffset } = this.props;
    const { showsPlaceholderImageLoading } = this.state;
    
    const defaultSource = require('app/assets/images/placeholder-image.png');
    const sourceProps = placeholderImage == null
      ? { source: defaultSource }
      : { defaultSource, source: { uri: placeholderImage } };

    const opacity = scrollOffset.interpolate({
      inputRange: [-height, 0, height],
      outputRange: [1, 1, 0.5],
    });
    
    return (
      <Animated.View style={[styles.placeholderImage, { opacity }]}>
        <Animated.Image
          {...sourceProps}
          onLoadEnd={() => this.setState({ showsPlaceholderImageLoading: false })}
          resizeMode="cover"
          style={SHEETS.absoluteFlex}
        />
        {showsPlaceholderImageLoading && <LoadingPlaceholder />}
        <FadedMask color={maskColor} height={height} scrollOffset={scrollOffset} />
      </Animated.View>
    );
  }

  render() {
    const { height, maskColor, items, scrollOffset } = this.props;
    const { playingVideoIndex } = this.state;
    if (_.isEmpty(items)) return this.renderPlaceholderImage();

    const { width } = DeviceUtils.screen;

    const pageHeight = scrollOffset.interpolate({
      inputRange: [-height, 0, height],
      outputRange: [height * 2, height, height],
    });

    return (
      <View>
        <PagedGallery>
          {_.map(items, (item, index) => (
            <Animated.View
              key={`gallery_page_${index}`}
              style={{ width, height: pageHeight }}
            >
              <GalleryPage
                item={item}
                onRevokePlaying={this.onRevokePlaying}
                playsVideo={playingVideoIndex === index}
              >
                {item.type !== galleryTypes.VIDEO ? null : (
                  <PlayButton
                    height={height}
                    onPress={() => this.setState({ playingVideoIndex: index })}
                    scrollOffset={scrollOffset}
                  />
                )}
              </GalleryPage>
            </Animated.View>
          ))}
        </PagedGallery>
        <FadedMask color={maskColor} height={height} scrollOffset={scrollOffset} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  placeholderImage: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
  },
});
