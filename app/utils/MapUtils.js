/**
 * @providesModule WeFit.Utils.MapUtils
 */

/* eslint-disable react-native/split-platform-components */
import { ActionSheetIOS, Linking } from 'react-native';
/* eslint-enable react-native/split-platform-components */
import Communications from 'react-native-communications';
import I18n from 'react-native-i18n';
import axios from 'axios';
import Singleton from 'singleton';
import { DeviceUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { DEBUGS } from 'app/constants/Flags';

const API_KEY = 'AIzaSyDKNOonwy2W2fzWaOQKSCxzCpuHIBlv8yw';
const DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';
const DIRECTIONS_API_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

class MapUtils extends Singleton {
  async requestDirections({ end, start }) {
    try {
      const body = {
        destination: end.toParams,
        key: API_KEY,
        mode: 'driving',
        origin: start.toParams,
      };

      const response = await axios.get(DIRECTIONS_API_URL, {
        params: body, headers: DIRECTIONS_API_HEADERS,
      });
      const { data: { status, routes, error_message: errorMessage } } = response;

      if (status !== 'OK')
        throw new Error(errorMessage);

      return routes;
    } catch (error) { throw error; }
  }

  openAppleMaps = params => Communications.web(`maps://?daddr=${params}`);
  openGoogleMapsAndroid = params => Communications.web(`google.navigation://?q=${params}`);
  openGoogleMapsIOS = params => {
    const schema = 'comgooglemaps-x-callback://';
    const callback = 'wefitapp://?x-source=comgoolemaps';
    Communications.web(`${schema}?q=${params}&x-success=${callback}`);
  };

  async openNavigation(destination) {
    const { toParams: params } = destination;

    // Android
    if (!DeviceUtils.platformIsIOS) {
      this.openGoogleMapsAndroid(params);
      return;
    }

    const canOpenGoogleMaps = await this.canOpenGoogleMaps() || DEBUGS.DIRECTIONS_ACTION_SHEET;

    if (!canOpenGoogleMaps) {
      this.openAppleMaps(params);
      return;
    }

    const { direction, cancel, useAppleMaps, useGoogleMaps } = I18n.t('detailScrollView.mapBox');

    ActionSheetIOS.showActionSheetWithOptions({
      cancelButtonIndex: 2,
      options: [useAppleMaps, useGoogleMaps, cancel],
      title: _.capitalize(direction),
    }, index => {
      switch (index) {
        case 0: this.openAppleMaps(params); break;
        case 1: this.openGoogleMapsIOS(params); break;
        default: break;
      }
    });
  }

  async canOpenAppleMaps() {
    if (!DeviceUtils.platformIsIOS) return false;

    try {
      return await Linking.canOpenURL('map://');
    } catch (error) {
      return false;
    }
  }
  
  async canOpenGoogleMaps() {
    if (!DeviceUtils.platformIsIOS) return true;

    try {
      return await Linking.canOpenURL('comgooglemaps-x-callback://');
    } catch (error) {
      return false;
    }
  }
}

export default MapUtils.get();
