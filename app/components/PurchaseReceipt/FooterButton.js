/**
 * @providesModule WeFit.Components.PurchaseReceipt.FooterButton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text } from 'react-native';
import Button from 'react-native-button';
import Spinner from 'react-native-spinkit';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function FooterButton({ disabled, loading, onPress, title }) {
  return (
    <Button containerStyle={styles.container} disabled={disabled} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
      {loading
        ? <Spinner color="#ffffff" isVisible size={25} style={styles.loading} type="ThreeBounce" />
        : <FontAwesome color="white" name="chevron-right" size={16} />
      }
    </Button>
  );
}

FooterButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

FooterButton.defaultProps = {
  disabled: false,
  loading: false,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    backgroundColor: COLORS.PINK,
    borderRadius: 4,
    height: 44,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  text: FontUtils.build({
    color: 'white',
    size: 17,
    weight: 'medium',

    // Extra
    flex: 1,
  }),
  loading: {
    ...Platform.select({ ios: { marginBottom: 5 } }),
  },
});
