/**
 * @providesModule WeFit.Models.Reservation
 */

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { ID, INTEGER, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class Reservation extends BaseModel {
  static dataValidator() {
    return {
      code: STRING,
      id: ID,
      session_id: INTEGER,
      status_code: INTEGER.required(),
      user_id: ID,
    };
  }

  get reservationCode() { return this.code; }
}

/* eslint-enable dot-notation, newline-per-chained-call */
