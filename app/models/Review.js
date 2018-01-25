/**
 * @providesModule WeFitApp.Models.Review
 */

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';
import SessionLite from 'app/models/SessionLite';

const { ID, INTEGER, OBJECT, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class Review extends BaseModel {
  static dataValidator(): Object {
    return {
      content: STRING,
      id: ID,
      rating_score: INTEGER,
      session: OBJECT.required(),
    };
  }

  constructor(data) {
    super(data);

    const { session } = data;
    this.session = SessionLite.build(session);
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
