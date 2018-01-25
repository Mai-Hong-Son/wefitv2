/**
 * @providesModule WeFit.Components.PurchaseReceipt.MembershipPackCard.ReceiptLine
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function ReceiptLine({ isFirst, isGrandTotal, price, title }) {
  return (
    <View style={[styles.container, isFirst && styles.containerFirst]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={isGrandTotal ? styles.grandTotal : styles.price}>{price}</Text>
    </View>
  );
}

ReceiptLine.propTypes = {
  isFirst: PropTypes.bool,
  isGrandTotal: PropTypes.bool,
  price: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

ReceiptLine.defaultProps = {
  isFirst: false,
  isGrandTotal: false,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  containerFirst: {
    marginTop: 0,
  },
  title: FontUtils.build({
    color: COLORS.ALL_9,
    size: 14,
  }),
  price: FontUtils.build({
    align: 'right',
    color: COLORS.WEFIT,
    size: 14,
  }),
  grandTotal: FontUtils.build({
    align: 'right',
    color: COLORS.WEFIT,
    size: 17,
    weight: 'medium',
  }),
});
