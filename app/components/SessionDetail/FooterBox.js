/**
 * @providesModule WeFit.Components.SessionDetail.FooterBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
import Studio from 'app/models/Studio';

export default function FooterBox({ onNavigate, studio }) {
  const { description, name } = studio || {};

  // Use custom <Button /> with <Text /> as child to make studio name 1 line
  return (
    <View style={styles.container}>
      <TextButton
        background={COLORS.PURPLE}
        onPress={() => onNavigate(MAIN_ROUTES.STUDIO_DETAIL, { studio })}
        singleLine
        title={_.toUpper(name)}
      />
      {!_.isEmpty(description) && <Text style={styles.descriptionText}>{description}</Text>}
    </View>
  );
}

FooterBox.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  studio: PropTypes.instanceOf(Studio),
};

FooterBox.defaultProps = {
  studio: null,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.ALL_E,
    marginHorizontal: -16,
    paddingBottom: 30,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  
  descriptionText: FontUtils.build({
    color: COLORS.ALL_6,
    size: 14,

    // Extra
    marginTop: 20,
  }),
});
