/**
 * @providesModule WeFit.Components.RedeemMembership.FinishMessage
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontUtils } from '@onaclover/react-native-utils';

// Components
import MembershipStatus from 'app/components/Reusables/MembershipStatus';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import Membership from 'app/models/Membership';

export default function FinishMessage({ membership }) {
  const { expireStats } = membership;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesome color="white" name="check" size={35} style={styles.icon} />
      </View>
      <Text style={styles.title}>{I18n.t('redeemMembership.finish.title')}</Text>
      <MembershipStatus
        color={COLORS.WEFIT}
        expireStats={expireStats}
        templates={I18n.t('redeemMembership.membershipStatus')}
      />
      <Text style={styles.info}>
        {I18n.t('redeemMembership.finish.message')}
      </Text>
    </View>
  );
}

FinishMessage.propTypes = {
  membership: PropTypes.instanceOf(Membership).isRequired,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
  },

  iconContainer: {
    backgroundColor: COLORS.PINK,
    borderRadius: 25,
    height: 50,
    width: 50,
  },

  icon: {
    backgroundColor: 'transparent',
    height: 50,
    width: 50,
    paddingLeft: 7,
    ...Platform.select({ android: { paddingTop: 8 }, ios: { lineHeight: 50 } }),
  },

  title: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',

    // Extra
    marginVertical: 20,
  }),

  info: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,

    // Extra
    marginTop: 20,
  }),
});
