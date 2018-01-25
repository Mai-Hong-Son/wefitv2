/**
 * @providesModule WeFit.Components.PurchaseReceipt.MembershipPackCard
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import formatNumber from 'format-number';
import _ from 'lodash';

// Constants
import { FORMATS } from 'app/constants/AppConstants';
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import MembershipPack from 'app/models/MembershipPack';

// Locals
import ReceiptLine from './ReceiptLine';

export default function MembershipPackCard({ data }) {
  const { discounts, name, finalPrice, original_price: originalPrice, subtitle } = data;
  const formatter = formatNumber({ negativeLeftSymbol: '- ', suffix: FORMATS.CURRENCY_SUFFIX });

  const { grandTotalTitle, originalPriceTitle } = I18n.t('purchaseReceipt.membershipPackCard');

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      {!_.isEmpty(subtitle) && <Text style={styles.subTitle}>{subtitle}</Text>}
      <View style={[styles.separator, styles.separatorFirst]} />
      <ReceiptLine isFirst price={formatter(originalPrice)} title={originalPriceTitle} />
      {_.map(discounts, ({ amount, name }, index) => (
        <ReceiptLine key={`receipt_line_${index}`} price={formatter(-amount)} title={name} />
      ))}
      <View style={styles.separator} />
      <ReceiptLine isFirst isGrandTotal price={formatter(finalPrice)} title={grandTotalTitle} />
    </View>
  );
}

MembershipPackCard.propTypes = {
  data: PropTypes.instanceOf(MembershipPack).isRequired,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.stretched,
    alignItems: 'stretch',
    backgroundColor: 'white',
    borderRadius: 4,
    marginTop: 32,
    padding: 16,
    paddingBottom: 20,
  },
  name: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,
  }),
  subTitle: FontUtils.build({
    color: COLORS.PINK,
    size: 14,
    style: 'italic',

    // Extra
    marginTop: 8,
  }),

  separator: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.ALL_C,
    height: 1,
    marginVertical: 16,
  },
  separatorFirst: {
    marginTop: 6,
  },
});
