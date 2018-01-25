/**
 * @providesModule WeFit.Components.Resuables.DetailScrollView.MapBox.MapActions
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Communications from 'react-native-communications';
import I18n from 'react-native-i18n';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import Location from 'app/models/Location';

// Utils
import MapUtils from 'app/utils/MapUtils';

export default function MapActions({ location, phone }) {
  if (location == null && phone == null) return null;

  return (
    <View style={styles.container}>
      {location != null && (
        <TextButton
          bordering
          containerStyle={styles.buttonLeft}
          flexSize
          onPress={() => MapUtils.openNavigation(location)}
          short
          singleLine
          title={I18n.t('detailScrollView.mapBox.direction')}
          titleColor={COLORS.PINK}
        />
      )}
      {phone != null && (
        <TextButton
          bordering
          flexSize
          onPress={() => Communications.phonecall(phone, true)}
          short
          singleLine
          title={I18n.t('detailScrollView.mapBox.callHotline')}
          titleColor={COLORS.PINK}
        />
      )}
    </View>
  );
}

MapActions.propTypes = {
  location: PropTypes.instanceOf(Location),
  phone: PropTypes.string,
};

MapActions.defaultProps = {
  location: null,
  phone: null,
};

const styles = {
  container: {
    ...SHEETS.horizontalFlex,
    marginTop: 10,
  },
  buttonLeft: {
    marginRight: 14,
  },
};
