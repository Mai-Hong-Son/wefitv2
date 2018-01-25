/**
 * @providesModule WeFit.Components.StudioDetail.FooterBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
import Studio from 'app/models/Studio';

export default function FooterBox({ onNavigate, sameBrandStudios }) {
  if (_.isEmpty(sameBrandStudios)) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{I18n.t('studioDetail.sameBrandStudios')}</Text>
      {_.map(sameBrandStudios, studio => (
        <TextButton
          background={COLORS.PURPLE}
          containerStyle={styles.buttonContainer}
          key={`same_brand_studio_${studio.id}`}
          onPress={() => onNavigate(MAIN_ROUTES.STUDIO_DETAIL, { studio })}
          singleLine
          title={_.toUpper(studio.name)}
        />
      ))}
    </View>
  );
}

FooterBox.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  sameBrandStudios: PropTypes.arrayOf(PropTypes.instanceOf(Studio)),
};

FooterBox.defaultProps = {
  sameBrandStudios: [],
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.ALL_E,
    marginHorizontal: -16,
    paddingBottom: 30,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  title: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',
  }),
  
  buttonContainer: {
    marginTop: 20,
  },
});
