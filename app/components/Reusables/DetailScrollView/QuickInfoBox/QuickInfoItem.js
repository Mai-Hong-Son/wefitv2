/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.QuickInfoBox.QuickInfoItem
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function QuickInfoItem({ borderless, icon, iconText, onNodeRef, onPress, title }) {
  if (_.isEmpty(title)) return <View style={styles.container} />;

  const placeholderIcon = <Text style={styles.iconText}>{'•••'}</Text>;
  const iconTextNode = _.isEmpty(iconText) ? placeholderIcon : <Text style={styles.iconText}>{iconText}</Text>;
  const iconNode = icon != null ? icon : iconTextNode;

  return (
    <Button
      containerStyle={styles.container}
      disabled={onPress == null}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View
          ref={ref => onNodeRef && onNodeRef(ref)}
          style={[styles.iconContainer, !borderless && styles.iconFrame]}
        >
          {iconNode}
        </View>
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
      </View>
    </Button>
  );
}

QuickInfoItem.propTypes = {
  borderless: PropTypes.bool,
  icon: PropTypes.any,
  iconText: PropTypes.string,
  onNodeRef: PropTypes.func,
  onPress: PropTypes.func,
  title: PropTypes.string,
};

QuickInfoItem.defaultProps = {
  borderless: false,
  icon: null,
  iconText: null,
  onNodeRef: null,
  onPress: null,
  title: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  title: FontUtils.build({
    align: 'center',
    color: COLORS.TRIPLE_6E,

    // Extra
    marginTop: 8,
  }),

  iconContainer: {
    ...SHEETS.container,
    flex: 0,
    height: 50,
    width: 50,
  },
  iconFrame: {
    borderColor: COLORS.ALL_C,
    borderRadius: 25,
    borderWidth: 1,
  },
  iconText: FontUtils.build({
    color: COLORS.ALL_6,
    size: 14,
  }),
});
