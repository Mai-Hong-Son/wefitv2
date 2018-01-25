/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.GalleryBox.GalleryPage
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, View } from 'react-native';

// Components
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

// Models
import GalleryItem, { galleryTypes } from 'app/models/GalleryItem';

// Locals
import YoutubePlayer from './YoutubePlayer';

export default class GalleryPage extends React.PureComponent {
  static propTypes = {
    children: PropTypes.element,
    item: PropTypes.instanceOf(GalleryItem).isRequired,
    onRevokePlaying: PropTypes.func.isRequired,
    playsVideo: PropTypes.bool,
  }

  static defaultProps = {
    children: null,
    playsVideo: false,
  };

  state = { loading: true };

  render() {
    const { children, item: { link, thumbnail, type }, onRevokePlaying, playsVideo } = this.props;
    const { loading } = this.state;

    if (playsVideo)
      return <YoutubePlayer link={link} onRevokePlaying={onRevokePlaying} />;

    return (
      <View style={SHEETS.container}>
        <Image
          onLoadEnd={() => this.setState({ loading: false })}
          resizeMode="cover"
          source={{ uri: type === galleryTypes.VIDEO ? thumbnail : link }}
          style={SHEETS.absoluteFlex}
        />
        {loading ? <LoadingPlaceholder /> : children}
      </View>
    );
  }
}
