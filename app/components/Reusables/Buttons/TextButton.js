/**
 * @providesModule WeFit.Components.Reusables.Buttons.TextButton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, ViewPropTypes } from 'react-native';
import Spinner from 'react-native-spinkit';
import Button from 'react-native-button';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS } from 'app/constants/AppStyles';

const BUTTON_HEIGHT_DEFAULT = 44;
const BUTTON_HEIGHT_SHORT = 32;

const TextButton = props => {
  const {
    background: backgroundColor, bordering, containerStyle, disabled, darkTitle,
    fitContent, flexSize, loading, onPress, short, singleLine, style, title, titleColor: color,
  } = props;

  const combinedContainerStyle = [
    styles.container,
    { backgroundColor },
    bordering && styles.containerBordering,
    flexSize && styles.containerFlex,
    !fitContent && styles.containerStretched,
    short && styles.containerShort,
    containerStyle,
    disabled && styles.containerDisabled,
  ];

  const titleStyle = [
    styles.title,
    { color },
    darkTitle && styles.titleDark,
    short && styles.titleShort,
    style,
  ];

  const spinner = <Spinner color="#ffffff" isVisible size={40} style={styles.loadingSpinner} type="ThreeBounce" />;

  const content = !singleLine ? title : (
    <Text numberOfLines={1} style={[titleStyle, disabled && styles.titleDisabled]}>
      {title}
    </Text>
  );

  return (
    <Button
      containerStyle={combinedContainerStyle}
      disabled={disabled || loading}
      loading={loading}
      onPress={onPress}
      style={titleStyle}
      styleDisabled={styles.titleDisabled}
    >
      {loading ? spinner : content}
    </Button>
  );
};

TextButton.propTypes = {
  background: PropTypes.string,
  bordering: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
  darkTitle: PropTypes.bool,
  disabled: PropTypes.bool,
  fitContent: PropTypes.bool,
  flexSize: PropTypes.bool,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  short: PropTypes.bool,
  singleLine: PropTypes.bool,
  style: Text.propTypes.style,
  title: PropTypes.string.isRequired,
  titleColor: PropTypes.string,
};

TextButton.defaultProps = {
  background: COLORS.PINK,
  bordering: false,
  containerStyle: null,
  darkTitle: false,
  disabled: false,
  fitContent: false,
  flexSize: false,
  loading: false,
  onPress: null,
  short: false,
  singleLine: false,
  style: null,
  titleColor: 'white',
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.PINK,
    borderRadius: 4,
    height: BUTTON_HEIGHT_DEFAULT,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  containerBordering: {
    backgroundColor: 'transparent',
    borderColor: COLORS.PINK,
    borderWidth: 2,
  },
  containerDisabled: {
    backgroundColor: COLORS.ALL_9,
  },
  containerFlex: {
    flex: 1,
  },
  containerShort: {
    height: BUTTON_HEIGHT_SHORT,
  },
  containerStretched: {
    alignSelf: 'stretch',
  },

  loadingSpinner: {
    ...Platform.select({ ios: { marginBottom: 10 } }),
  },

  title: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 17,
    weight: 'semibold',
  }),
  titleDark: {
    color: COLORS.WEFIT,
  },
  titleDisabled: {
    color: 'white',
  },
  titleShort: {
    fontSize: 14,
  },
});

export default TextButton;
