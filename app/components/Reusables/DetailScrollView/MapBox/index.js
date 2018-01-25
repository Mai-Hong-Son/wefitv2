/**
 * @providesModule WeFit.Components.Resuables.DetailScrollView.MapBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import I18n from 'react-native-i18n';
import MapView, { Marker } from 'react-native-maps';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { APP_CONFIGS } from 'app/constants/AppConstants';
import { DEBUGS } from 'app/constants/Flags';
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import Studio from 'app/models/Studio';

// Locals
import MapActions from './MapActions';

export default class MapBox extends React.PureComponent {
  static propTypes = {
    height: PropTypes.number,
    scrollHeight: PropTypes.number,
    studio: PropTypes.instanceOf(Studio).isRequired,
  };
  
  static defaultProps = {
    height: 200,
    scrollHeight: 0,
  };

  constructor(props) {
    super(props);

    const { location } = this.props.studio || {};

    this.containerHeight = null;
    this.containerOffset = null;
    this.mapRegion = { ...location, ...APP_CONFIGS.MAP_SCALE };
    this.state = { renderMap: false };
  }

  onLayout = event => {
    if (this.containerHeight != null) return;

    const { height, y: offset } = event.nativeEvent.layout;
    this.containerHeight = height;
    this.containerOffset = offset;
  };

  updateScrollOffset = scrollOffset => {
    if (this.state.renderMap) return;

    const { scrollHeight } = this.props;
    if (this.containerOffset + scrollHeight - scrollOffset - this.containerHeight < 0)
      this.setState({ renderMap: true });
  };

  renderMapView = () => {
    const { height, studio } = this.props;
    const { location } = studio || {};
    if (location == null) return null;

    if (DEBUGS.DISABLED_MAPS_IN_DETAIL || !this.state.renderMap)
      return <View style={[styles.mapPlaceholder, { height }]} />;

    return (
      <MapView
        onRegionChangeComplete={region => this.mapRegion = region}
        region={this.mapRegion}
        style={[styles.mapView, { height }]}
      >
        <Marker coordinate={location} image={require('app/assets/icons/generic-map-marker.png')} />
      </MapView>
    );
  };

  render() {
    const { address, location, navigation_tip: tip, phone } = this.props.studio || {};
    if (location == null) return null;

    return (
      <View onLayout={this.onLayout} style={styles.container}>
        <Text style={styles.title}>{I18n.t('detailScrollView.mapBox.title')}</Text>
        <Text style={styles.text}>{address}</Text>
        {this.renderMapView()}
        {!_.isEmpty(tip) && <Text style={styles.text}>{tip}</Text>}
        <MapActions location={location} phone={phone} />
      </View>
    );
  }
}

const styles = {
  container: {
    paddingVertical: 20,
  },
  title: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',
  }),
  text: FontUtils.build({
    color: COLORS.ALL_6,

    // Extra
    marginTop: 10,
  }),
  mapPlaceholder: {
    alignSelf: 'stretch',
    backgroundColor: COLORS.ALL_E,
    marginTop: 10,
  },
  mapView: {
    alignSelf: 'stretch',
    marginTop: 10,
  },
  buttonsWrapper: {
    ...SHEETS.horizontalFlex,
    marginTop: 10,
  },
  buttonContainer: {
    ...SHEETS.container,
    borderColor: COLORS.PINK,
    borderWidth: 2,
    borderRadius: 4,
    flex: 1,
    height: 44,
  },
  buttonLeft: {
    marginRight: 16,
  },
  buttonText: FontUtils.build({
    align: 'center',
    color: COLORS.PINK,
    size: 17,
    weight: 'semibold',
  }),
};
