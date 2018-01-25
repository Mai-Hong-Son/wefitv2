/**
 * @providesModule WeFit.Models.PromoData
 */

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';
import MembershipPack from 'app/models/MembershipPack';

const { OBJECTS_ARRAY, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class PromoData extends BaseModel {
  static dataValidator() {
    return {
      code: STRING.required(),
      memberships: OBJECTS_ARRAY,
      name: STRING,
      type: STRING,
    };
  }

  constructor(data) {
    super(data);

    const { memberships } = data;
    this.memberships = MembershipPack.buildArray(memberships);
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
