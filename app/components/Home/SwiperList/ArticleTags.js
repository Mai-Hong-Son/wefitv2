/**
 * @providesModule WeFit.Components.Home.Swiper.ArticleTags
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS } from 'app/constants/AppStyles';

export default function ArticleTags({ tags }) {
  if (_.isEmpty(tags)) return null;
  
  return (
    <View style={styles.container}>
      {_.map(tags, (tag, index) => (
        <View key={`article_tag_${index}`} style={styles.tagContainer}>
          <Text style={styles.name}>{_.toUpper(tag)}</Text>
        </View>
      ))}
    </View>
  );
}

ArticleTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 5,
    overflow: 'hidden',
    width: 124,
    marginRight: 5,
  },
  tagContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    marginTop: 5,
    paddingHorizontal: 5,
    paddingVertical: 0,
  },
  name: FontUtils.build({
    color: COLORS.WEFIT,
    size: 12,
    weight: 'semibold',
  }),
});
