/**
 * @providesModule WeFit.Models.Location
 */

import Joi from 'react-native-joi';

// Constants
import { APP_CONFIGS } from 'app/constants/AppConstants';

// Models
import BaseModel from 'app/models/BaseModel';

/* eslint-disable dot-notation, newline-per-chained-call */

export default class Location extends BaseModel {
  static dataValidator() {
    return {
      // Floating-point number in range of [-90, 90]
      latitude: Joi.number().min(-90).max(90).required(),
      // Floating-point number in range of [-180, 180]
      longitude: Joi.number().min(-180).max(180).required(),
    };
  }

  static defaultLocation(cityCode) {
    const { [cityCode]: data, HN: defaultData } = APP_CONFIGS.DEFAULT_LOCATIONS;
    return Location.build(data || defaultData);
  }

  get toLatLng() {
    return { lat: this.latitude, lng: this.longitude };
  }

  get toParams() {
    return [this.latitude, this.longitude].join();
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
