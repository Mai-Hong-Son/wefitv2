/**
 * @providesModule WeFit.Components.Reusables.Buttons.HotlineButton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import Button from 'react-native-button';
import Communications from 'react-native-communications';
import I18n from 'react-native-i18n';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function HotlineButton({ bordering, number, title }) {
  if (_.isEmpty(number)) return null;

  const hotlineNumber = _.replace(number, /\s+/g, '');

  return (
    <Button
      containerStyle={[styles.container, bordering && styles.containerBordering]}
      onPress={() => Communications.phonecall(hotlineNumber, true)}
    >
      <FontAwesome color="white" name="phone" size={20} />
      <Text style={styles.text}>{title || I18n.t('reusables.hotlineButton')}</Text>
    </Button>
  );
}

HotlineButton.propTypes = {
  bordering: PropTypes.bool,
  number: PropTypes.string,
  title: PropTypes.string,
};

HotlineButton.defaultProps = {
  bordering: false,
  number: null,
  title: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    backgroundColor: COLORS.PINK,
    borderRadius: 4,
    height: 32,
    paddingHorizontal: 10,
  },
  containerBordering: {
    backgroundColor: 'transparent',
    borderColor: COLORS.PINK,
    borderWidth: 2,
  },
  text: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 14,
    weight: 'semibold',

    // Extra
    marginLeft: 5,
  }),
});
