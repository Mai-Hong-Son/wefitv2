/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.GalleryBox.YoutubePlayer
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import Youtube from 'react-native-youtube';

const PROP_TYPES = {
  link: PropTypes.string.isRequired,
  onRevokePlaying: PropTypes.func,
};

const DEFAULT_PROPS = {
  link: PropTypes.string.isRequired,
  onRevokePlaying: null,
};

function YoutubePlayerAndroid({ link, onRevokePlaying }) {
  const { apiKey } = require('app/data/configs/youtube.json');

  return (
    <Youtube
      apiKey={apiKey}
      fullscreen
      modestbranding
      onChangeFullscreen={({ isFullscreen }) => !isFullscreen && onRevokePlaying()}
      play
      rel={false}
      showinfo={false}
      style={styles.player}
      videoId={link}
    />
  );
}

YoutubePlayerAndroid.propTypes = PROP_TYPES;
YoutubePlayerAndroid.defaultProps = DEFAULT_PROPS;

function YoutubePlayerIOS({ link }) {
  return (
    <Youtube
      modestbranding
      play
      rel={false}
      showinfo={false}
      style={styles.player}
      videoId={link}
    />
  );
}

YoutubePlayerIOS.propTypes = PROP_TYPES;
YoutubePlayerIOS.defaultProps = DEFAULT_PROPS;

const YoutubePlayer = Platform.select({ android: YoutubePlayerAndroid, ios: YoutubePlayerIOS });

export default YoutubePlayer;

const styles = StyleSheet.create({
  player: {
    flex: 1,
  },
});
