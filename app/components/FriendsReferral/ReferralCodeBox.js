/**
 * @providesModule WeFit.Components.FriendsReferral.ReferralCodeBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Button from 'react-native-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default function ReferralCodeBox({ code, onCopy }) {
  const enabled = !_.isEmpty(code);

  return (
    <TouchableWithoutFeedback onPress={onCopy}>
      <View style={[styles.container, !enabled && styles.containerDisabled]}>
        <Text style={styles.codeText}>{enabled ? code : '--------'}</Text>
        {enabled && (
          <Button containerStyle={styles.copyButton} onPress={onCopy}>
            <MaterialCommunityIcons color={COLORS.WEFIT} name="content-copy" size={24} />
          </Button>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

ReferralCodeBox.propTypes = {
  code: PropTypes.string,
  onCopy: PropTypes.func,
};

ReferralCodeBox.defaultProps = {
  code: null,
  onCopy: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderRadius: 4,
    height: 44,
    marginVertical: 20,
  },
  containerDisabled: {
    backgroundColor: COLORS.ALL_C,
  },
  codeText: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 24,
    weight: 'semibold',
  }),
  copyButton: {
    position: 'absolute',
    right: 16,
  },
});
