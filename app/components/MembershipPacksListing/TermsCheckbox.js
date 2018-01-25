/**
 * @providesModule WeFit.Components.MembershipPacksListing.TermsCheckbox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function TermsCheckbox({ onOpenTerms, onSelect, selected }) {
  const { acceptance, terms } = I18n.t('membershipPacks.termsCheckbox');
  const termsUri = `https://wefit.vn/terms_of_use?lang=${I18n.currentLocale()}`;

  return (
    <Button containerStyle={styles.container} onPress={onSelect}>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]} />
      <Text style={styles.text}>{acceptance}</Text>
      <Button onPress={() => onOpenTerms(termsUri)} style={[styles.text, styles.termsLink]}>
        {terms}
      </Button>
    </Button>
  );
}

TermsCheckbox.propTypes = {
  onOpenTerms: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
};

TermsCheckbox.defaultProps = {
  onOpenTerms: null,
  onSelect: null,
  selected: false,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    marginBottom: 20,
    marginTop: 20,
    overflow: 'hidden',
  },
  checkbox: {
    backgroundColor: 'white',
    borderRadius: 3,
    height: 20,
    marginRight: 10,
    width: 20,
  },
  checkboxSelected: {
    backgroundColor: COLORS.PINK,
  },
  text: FontUtils.build({
    color: 'white',
    size: 17,
  }),
  termsLink: {
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});
