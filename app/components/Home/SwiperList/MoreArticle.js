/**
 * @providesModule WeFit.Components.Home.Swiper.MoreArticle
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import LinearGradient from 'react-native-linear-gradient';
import icon1 from 'app/assets/images/icon1.png';
import { FontUtils } from '@onaclover/react-native-utils';

export default function MoreArticle({ size, onSeeAll }) {
  const { seeMore } = I18n.t('home.swiper');
  return (
    <Button onPress={onSeeAll}>
      <LinearGradient
        colors={['#E81E82', '#B62986', '#83358B']}
        end={{ x: 1, y: 1.5 }}
        start={{ x: 0.0, y: 0.25 }}
        style={[styles.linearGradient, { height: size }]}
      >
        <View
          style={[styles.container, { height: size - 8 }]}
        >
          <Text style={styles.text} />
          <Image source={icon1} style={styles.icon} />
          <Text style={styles.text}>{seeMore}</Text>
        </View>
      </LinearGradient>
    </Button>
  );
}

MoreArticle.propTypes = {
  onSeeAll: PropTypes.func,
  size: PropTypes.number.isRequired,
};

MoreArticle.defaultProps = {
  onSeeAll: null,
};

const styles = StyleSheet.create({
  container: {
    width: 132,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  icon: {
    width: 30,
    height: 30,
  },
  text: FontUtils.build({
    backgroundColor: 'rgba(0,0,0,0)',
    color: '#E82E81',
    fontSize: 14,
    marginTop: 16,
  }),
  linearGradient: {
    width: 140,
    marginRight: 16,
    borderRadius: 4,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
