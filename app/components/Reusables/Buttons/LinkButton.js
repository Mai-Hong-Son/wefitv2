/**
 * @providesModule WeFit.Components.Reusables.LinkButton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ViewPropTypes } from 'react-native';
import Button from 'react-native-button';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
// import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function LinkButton({ containerStyle, disabled, onPress, style, title }) {
  return (
    <Button
      containerStyle={containerStyle}
      disabled={disabled}
      onPress={onPress}
      style={[styles.linkText, style]}
    >
      {title}
    </Button>
  );
}

LinkButton.propTypes = {
  containerStyle: ViewPropTypes.style,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
  title: PropTypes.string.isRequired,
};

LinkButton.defaultProps = {
  containerStyle: null,
  disabled: false,
  onPress: null,
  style: null,
};

const styles = StyleSheet.create({
  linkText: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 14,

    // Extra
    textDecorationColor: 'white',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  }),
});
