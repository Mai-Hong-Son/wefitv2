/**
 * @providesModule WeFit.Models.Feeds.SessionFeed
 */

// Constants
import { FEED_TYPES } from 'redux/constants';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';
import Session from 'app/models/Session';

const { INTEGER, OBJECT, STRING } = COMMON_SCHEMAS;
const { SESSION_OCCURRING, SESSION_REVIEW, SESSION_UPCOMING } = FEED_TYPES;

/* eslint-disable camelcase, dot-notation, newline-per-chained-call */

export default class SessionFeed extends BaseModel {
  static dataValidator() {
    return {
      review_id: INTEGER,
      session: OBJECT.required(),
      type: STRING.allow([SESSION_OCCURRING, SESSION_REVIEW, SESSION_UPCOMING]).required(),
    };
  }

  constructor(data) {
    super(data);

    const { session } = data;
    this.session = Session.build(session);
  }
}

/* eslint-enable camelcase, dot-notation, newline-per-chained-call */
