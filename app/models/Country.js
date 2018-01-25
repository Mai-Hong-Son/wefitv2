/**
 * @providesModule WeFit.Models.Country
 */

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { ID, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class Country extends BaseModel {
  static dataValidator() {
    return {
      code: STRING.required(),
      id: ID,
      name: STRING.required(),
    };
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
