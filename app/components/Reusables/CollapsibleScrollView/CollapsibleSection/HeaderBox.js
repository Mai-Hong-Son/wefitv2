/**
 * @providesModule WeFit.Components.Reusables.CollapsibleScrollView.CollapsibleSection.HeaderBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import { FontUtils } from '@onaclover/react-native-utils';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

const AnimatedFontAwesome = Animated.createAnimatedComponent(FontAwesome);

export default function HeaderBox({ index, onToggle, title, visibleValue }) {
  if (_.isEmpty(title)) return null;

  const rotate = visibleValue.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-180deg', '0deg', '180deg'],
  });

  const chevron = (
    <AnimatedFontAwesome
      color={COLORS.ALL_C}
      name="chevron-down"
      size={20}
      style={{ transform: [{ rotate }] }}
    />
  );

  return (
    <Button
      containerStyle={styles.container}
      disabled={onToggle == null}
      onPress={() => onToggle && onToggle(index)}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {onToggle != null && chevron}
      </View>
    </Button>
  );
}

HeaderBox.propTypes = {
  index: PropTypes.number.isRequired,
  onToggle: PropTypes.func,
  title: PropTypes.string.isRequired,
  visibleValue: PropTypes.instanceOf(Animated.Value).isRequired,
};

HeaderBox.defaultProps = {
  onToggle: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    backgroundColor: COLORS.WHITE_OPAQUE_MIN,
    height: 32,
    paddingHorizontal: 16,
  },
  content: {
    ...SHEETS.horizontalFlex,
    flex: 1,
    justifyContent: 'space-between',
  },
  title: FontUtils.build({
    color: 'white',
    weight: 'semibold',
  }),
});
