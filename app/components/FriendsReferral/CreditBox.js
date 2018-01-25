/**
 * @providesModule WeFit.Components.FriendsReferral.CreditBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

// Components
import HighlightText from 'app/components/Reusables/HighlightText';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Utils
import { formatText } from 'app/utils';

export default function CreditBox({ credit, friends, onOpenStore }) {
  const {
    friends: { none, plural: friendsPlural, singular: friendsSingular },
    points: { plural: pointsPlural, singular: pointsSingular, status },
  } = I18n.t('referral.creditBox');

  const pointsText = formatText(credit > 1 ? pointsPlural : pointsSingular, credit);

  const friendsTemplate = friends > 1 ? friendsPlural : friendsSingular;
  const friendsNone = friends === 0 ? none : null;
  const friendsText = friends < 1 ? friendsNone : formatText(friendsTemplate, friends);

  return (
    <View style={styles.container}>
      <View style={styles.creditsContainer}>
        <HighlightText highlightWords={[pointsText]} template={formatText(status, pointsText)} />
      </View>
      {friendsText && (
        <HighlightText
          highlightWords={[`${friends}`]}
          style={styles.friendsText}
          styleHighlight={styles.friendsHighlight}
          template={friendsText}
        />
      )}
      {onOpenStore != null && (
        <Button
          containerStyle={styles.storeButtonContainer}
          onPress={onOpenStore}
          style={styles.storeButtonText}
        >
          {I18n.t('referral.creditBox.creditStore')}
        </Button>
      )}
    </View>
  );
}

CreditBox.propTypes = {
  credit: PropTypes.number,
  friends: PropTypes.number,
  onOpenStore: PropTypes.func,
};

CreditBox.defaultProps = {
  credit: 0,
  friends: 0,
  onOpenStore: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.stretched,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ALL_C,
    marginTop: 20,
    paddingBottom: 20,
  },
  
  creditsContainer: {
    ...SHEETS.stretched,
    backgroundColor: COLORS.WHITE_OPAQUE_MIN,
    borderRadius: 4,
    height: 44,
    paddingVertical: 10,
  },
  
  friendsText: {
    fontSize: 13,
    marginTop: 14,
  },
  friendsHighlight: {
    fontSize: 14,
  },

  storeButtonContainer: {
    borderColor: COLORS.PINK,
    borderRadius: 4,
    borderWidth: 2,
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  storeButtonText: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 14,
    weight: 'semibold',
  }),
});
