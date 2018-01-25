/**
 * @providesModule WeFit.Models.User
 */

// Models
import AccountSettings from 'app/models/AccountSettings';
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';
import Membership from 'app/models/Membership';
import Referral from 'app/models/Referral';

const { DATE, ID, OBJECT, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class User extends BaseModel {
  static dataValidator() {
    return {
      address: STRING,
      auth_token: STRING.required(),
      avatar: STRING,
      
      birthday: DATE,
      city_code: STRING,
      
      email: STRING.required(),
      gender: STRING,
      id: ID,
      
      membership: OBJECT.required(),
      name: STRING,
      
      phone: STRING,
      referral: OBJECT,
      settings: OBJECT.required(),
    };
  }

  constructor(data) {
    super(data);

    const { membership, referral, settings } = data;
    this.membership = Membership.build(membership);
    this.referral = Referral.build(referral) || {};
    this.settings = AccountSettings.build(settings) || {};
  }

  get displayName() { return this.name || this.email; }
}

/* eslint-enable dot-notation, newline-per-chained-call */
