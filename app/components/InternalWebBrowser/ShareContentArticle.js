/**
 * @providesModule WeFit.Components.Home.InternalWebBrowser.ShareContentArticle
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from 'app/constants/AppStyles';
import ShareButton from './ShareButton';

export default function ShareContentArticle({ title, uri }) {
  return (
    <View style={styles.header}>
      <ShareButton title={title} uri={uri} />
    </View>
  );
}

ShareContentArticle.propTypes = {
  title: PropTypes.string.isRequired,
  uri: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.PURPLE,
    height: 44,
    flexDirection: 'row',
  },
});
