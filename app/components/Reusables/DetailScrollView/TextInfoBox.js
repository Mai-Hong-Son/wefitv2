/**
 * @providesModule WeFit.Components.Resuables.DetailScrollView.TextInfoBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS } from 'app/constants/AppStyles';

export default function TextInfoBox({ contents, hasSeparator }) {
  if (_.isEmpty(contents)) return null;
  
  return (
    <View style={[styles.container, hasSeparator && styles.hasSeparator]}>
      {_.map(contents, ({ text, title }, idx) => (
        <View key={`text_info_content_${idx}`}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
      ))}
    </View>
  );
}

TextInfoBox.propTypes = {
  contents: PropTypes.arrayOf(PropTypes.shape().isRequired),
  hasSeparator: PropTypes.bool,
};

TextInfoBox.defaultProps = {
  contents: [],
  hasSeparator: true,
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingTop: 20,
  },
  hasSeparator: {
    borderBottomColor: COLORS.ALL_C,
    borderBottomWidth: 1,
  },
  title: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',
  }),
  text: FontUtils.build({
    color: COLORS.ALL_6,

    // Extra
    marginVertical: 10,
  }),
});
