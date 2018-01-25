/**
 * @providesModule WeFit.Models.DisplayAmenity
 */

import formatNumber from 'format-number';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { INTEGER, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class DisplayAmenity extends BaseModel {
  static dataValidator() {
    return {
      code: STRING.required(),
      name: STRING,
      price: INTEGER,
    };
  }

  get displayName() {
    const { name, price } = this;
    if (price <= 0) return name;
    
    const formattedPrice = formatNumber({ suffix: '₫' })(price < 1000 ? price * 1000 : price);
    return `${name} ${formattedPrice}`;
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
