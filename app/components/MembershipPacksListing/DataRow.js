/**
 * @providesModule WeFit.Components.MembershipPacksListing.DataRow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontUtils } from '@onaclover/react-native-utils';
import formatNumber from 'format-number';
import _ from 'lodash';

// Constants
import { FORMATS } from 'app/constants/AppConstants';
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import MembershipPack from 'app/models/MembershipPack';

export default function DataRow({ data, onSelect, selected }) {
  const { couponPrice, in_promotion: inPromotion, name, original_price: originalPrice, subtitle } = data;
  const formatter = formatNumber({ suffix: FORMATS.CURRENCY_SUFFIX });

  return (
    <Button containerStyle={styles.container} onPress={() => onSelect(data)}>
      <View style={styles.checkContainer}>
        <View style={[styles.checkBackground, selected && styles.checkBackgroundSelected]}>
          {selected && <FontAwesome color="white" name="check" size={16} />}
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        {!_.isEmpty(subtitle) && <Text style={styles.subTitle}>{subtitle}</Text>}
        <View style={styles.footerBox}>
          {originalPrice !== couponPrice && <Text style={styles.originalPrice}>{formatter(originalPrice)}</Text>}
          <Text style={[styles.price, selected && styles.priceSelected]}>{formatter(couponPrice)}</Text>
        </View>
      </View>
      {inPromotion && (
        <Image
          source={require('app/assets/icons/promotion-mark.png')}
          style={styles.promotionMark}
        />
      )}
    </Button>
  );
}

DataRow.propTypes = {
  data: PropTypes.instanceOf(MembershipPack).isRequired,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

DataRow.defaultProps = {
  selected: false,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    backgroundColor: 'white',
    borderRadius: 4,
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 16,
  },
  checkContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    marginLeft: 12,
    marginRight: 20,
    marginTop: 12,
  },
  checkBackground: {
    alignItems: 'center',
    backgroundColor: COLORS.ALL_C,
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkBackgroundSelected: {
    backgroundColor: COLORS.PINK,
  },
  content: {
    flex: 1,
    marginBottom: 8,
    marginRight: 16,
    marginTop: 15,
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
  footerBox: {
    ...SHEETS.horizontalFlex,
    alignItems: 'flex-end',
    borderTopColor: COLORS.ALL_C,
    borderTopWidth: 1,
    justifyContent: 'flex-end',
    marginTop: 9,
    paddingTop: 6,
  },
  originalPrice: FontUtils.build({
    color: COLORS.ALL_9,
    size: 14,
    textDecorationLine: 'line-through',

    // Extra
    marginRight: 8,
  }),
  price: FontUtils.build({
    color: COLORS.WEFIT,
    size: 20,
    weight: 'medium',
  }),
  priceSelected: {
    color: COLORS.PINK,
  },
  promotionMark: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
