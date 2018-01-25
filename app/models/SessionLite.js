/**
 * @providesModule WeFit.Models.SessionLite
 */

import moment from 'moment';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { DATE, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class SessionLite extends BaseModel {
  static dataValidator() {
    return {
      instruction_name: STRING,
      name: STRING.required(),
      start_at: DATE,
      studio_name: STRING,
    };
  }

  get startMoment() { return moment(this.start_at); }
}

/* eslint-enable dot-notation, newline-per-chained-call */
