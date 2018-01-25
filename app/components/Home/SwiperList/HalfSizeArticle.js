/**
 * @providesModule WeFit.Components.Home.Swiper.HalfSizeArticle
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import { FontUtils } from '@onaclover/react-native-utils';

// Models
import Article from 'app/models/Feeds/Article';

// Constants
import { COLORS } from 'app/constants/AppStyles';

export default function HalfSizeArticle({ data, onSelect }) {
  const { thumbnail, title } = data;

  return (
    <Button onPress={onSelect}>
      <View style={styles.container}>
        <Image source={{ uri: thumbnail }} style={styles.image} />
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
      </View>
    </Button>
  );
}

HalfSizeArticle.propTypes = {
  data: PropTypes.instanceOf(Article).isRequired,
  onSelect: PropTypes.func,
};

HalfSizeArticle.defaultProps = {
  onSelect: null,
};

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    width: 140,
  },
  image: {
    borderRadius: 4,
    height: 140,
    marginBottom: 10,
    resizeMode: 'cover',
    width: 140,
  },
  title: FontUtils.build({
    color: COLORS.WEFIT,
    size: 14,
  }),
});
