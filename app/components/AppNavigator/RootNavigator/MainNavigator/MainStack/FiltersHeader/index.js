/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.MainStack.FiltersHeader
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import { DeviceUtils, FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import Props from 'app/components/Reusables/Props';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Constants
import { COLORS, NAVIGATION, SHEETS } from 'app/constants/AppStyles';

// Utils
import { hasFilters } from 'app/utils/FilterHelpers';

// Locals
import withConnect from './withConnect';

@withConnect
export default class FiltersHeader extends React.PureComponent {
  static propTypes = {
    filters: Props.filters.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  render() {
    const { filters, onPress } = this.props;

    const { amenities, districts, fitnessTypes, timeRanges } = filters;
    const icon = <Image source={require('app/assets/icons/filters.png')} style={styles.icon} />;

    let label = null;

    if (!hasFilters(filters))
      label = I18n.t('filters.allSessions');
    else {
      const values = _.compact([
        !_.isEmpty(timeRanges) && _.map(timeRanges, 'name').join(', '),
        !_.isEmpty(districts) && _.map(districts, 'name').join(', '),
        !_.isEmpty(fitnessTypes) && _.map(fitnessTypes, 'name').join(', '),
        !_.isEmpty(amenities) && _.map(amenities, 'name').join(', '),
      ]);

      label = values.join(' • ');
    }

    return (
      <Button containerStyle={styles.container} onPress={onPress}>
        {icon}
        <View style={styles.valuesContainer}>
          <Text numberOfLines={1} style={styles.filterValue}>{label}</Text>
        </View>
      </Button>
    );
  }
}

export const withFiltersHeader = {
  navigationOptions: ({ navigation: { navigate } }) => ({
    headerStyle: [NAVIGATION.defaultHeader, NAVIGATION.filtersHeader],
    headerTitle: <FiltersHeader onPress={() => navigate(MAIN_ROUTES.FILTERS)} />,
  }),
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    backgroundColor: COLORS.WHITE_OPAQUE_MIN,
    borderRadius: 4,
    height: 44,
    justifyContent: 'flex-start',
    paddingLeft: 13,
    width: DeviceUtils.screen.width - 16 * 2,
    ...Platform.select({ android: { marginLeft: 16 } }),
  },
  icon: {
    height: 18,
    width: 18,
    marginRight: 10,
  },
  
  valuesContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  filterValue: FontUtils.build({
    color: 'white',
  }),
});
