/**
 * @providesModule WeFit.Models.Referral
 */

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { ID, INTEGER, OBJECT, STRING } = COMMON_SCHEMAS;

/* eslint-disable newline-per-chained-call */

class ReferredUser extends BaseModel {
  static dataValidator() {
    return {
      id: ID,
      name: STRING,
    };
  }
}

export default class Referral extends BaseModel {
  static dataValidator() {
    return {
      code: STRING,
      credit: INTEGER,
      friends: INTEGER,
      referred_by: OBJECT,
    };
  }

  constructor(data) {
    super(data);
    
    const { referred_by: referredBy } = data;
    this.referred_by = ReferredUser.build(referredBy);
  }
}

/* eslint-enable newline-per-chained-call */
