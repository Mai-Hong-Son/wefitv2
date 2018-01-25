/**
 * @providesModule WeFit.Components.Home.Swiper.FullSizeArticle
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import LinearGradient from 'react-native-linear-gradient';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

// Models
import Article from 'app/models/Feeds/Article';

// Locals
import ArticleTags from './ArticleTags';

export default function FullSizeArticle({ data, onSelect }) {
  const { thumbnail, tags, title } = data;

  return (
    <Button onPress={onSelect}>
      <View style={styles.container}>
        <Image resizeMethod="resize" resizeMode="cover" source={{ uri: thumbnail }} style={styles.background} />
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.7)', 'transparent']}
          end={{ x: 0.5, y: 0 }}
          start={{ x: 0.5, y: 1 }}
          style={styles.background}
        />
        <ArticleTags tags={tags} />
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
      </View>
    </Button>
  );
}

FullSizeArticle.propTypes = {
  data: PropTypes.instanceOf(Article).isRequired,
  onSelect: PropTypes.func,
};

FullSizeArticle.defaultProps = {
  onSelect: null,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    height: 200,
    justifyContent: 'flex-end',
    marginRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 5,
    width: 140,
  },
  background: {
    ...SHEETS.absoluteFlex,
    borderRadius: 4,
  },
  title: FontUtils.build({
    color: 'white',
    size: 14,
  }),
});
