/**
 * @providesModule WeFit.Components.Reusables.WarningBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

const RESERVE_CANCEL = 'reserveCancel';
const DETAIL_SCROLL_VIEW = 'sessionDetail';

const EXTRA_STYLES_MAPPING = {
  [DETAIL_SCROLL_VIEW]: {
    backgroundColor: COLORS.PINK_OPAQUE,
    color: COLORS.WEFIT,
    hasSeparator: true,
  },
  [RESERVE_CANCEL]: {
    backgroundColor: COLORS.WHITE_OPAQUE_MIN,
    color: 'white',
    hasSeparator: false,
  },
};

export const variants = { DETAIL_SCROLL_VIEW, RESERVE_CANCEL };

export default function WarningBox({ message, variant }) {
  if (_.isEmpty(message)) return null;
  
  const { [variant]: { backgroundColor, color, hasSeparator } } = EXTRA_STYLES_MAPPING;

  const content = (
    <View style={[styles.content, { backgroundColor }]}>
      <FontAwesome color={COLORS.PINK} name="warning" size={20} />
      <Text style={[styles.message, { color }]}>{message}</Text>
    </View>
  );

  if (!hasSeparator) return content;

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
}

WarningBox.propTypes = {
  message: PropTypes.string,
  variant: PropTypes.oneOf(_.values(variants)).isRequired,
};

WarningBox.defaultProps = {
  message: null,
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: COLORS.ALL_C,
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  content: {
    ...SHEETS.horizontalFlex,
    backgroundColor: COLORS.PINK_OPAQUE,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  message: FontUtils.build({
    color: COLORS.WEFIT,
    
    // Extra
    flex: 1,
    marginLeft: 10,
  }),
});
