/**
 * @providesModule WeFit.Components.Reusables.Loadings.LoadingButton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Spinner from 'react-native-spinkit';
import Button from 'react-native-button';

export default function LoadingButton(props) {
  const { children, disabled, loading, loadingProps, onPress } = props;

  const spinnerProps = {
    color: '#ffffff',
    isVisible: true,
    size: 40,
    style: Platform.select({ ios: { marginBottom: 10 } }),
    type: 'ThreeBounce',
    ...loadingProps,
  };
  
  const buttonProps = {
    ...props,
    disabled: disabled || loading,
    onPress: loading ? null : onPress,
  };

  return (
    <Button {...buttonProps}>
      {loading ? <Spinner {...spinnerProps} /> : children}
    </Button>
  );
}

LoadingButton.propTypes = {
  ...Button.propTypes,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  loading: PropTypes.bool,
  loadingProps: PropTypes.object,
  onPress: PropTypes.func,
};

LoadingButton.defaultProps = {
  children: null,
  loading: false,
  loadingProps: null,
  onPress: null,
};
