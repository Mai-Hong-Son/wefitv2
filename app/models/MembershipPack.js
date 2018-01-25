/**
 * @providesModule WeFit.Models.MembershipPack
 */

import _ from 'lodash';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { BOOLEAN, ID, INTEGER, OBJECTS_ARRAY, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

class Discount extends BaseModel {
  static dataValidator() {
    return {
      amount: INTEGER.required(),
      extra: BOOLEAN.default(false),
      name: STRING.required(),
    };
  }
}

export default class MembershipPack extends BaseModel {
  static dataValidator() {
    return {
      days: INTEGER,
      description: STRING,
      discounts: OBJECTS_ARRAY,
      
      id: ID,
      ignore_quota: BOOLEAN.default(true),
      in_promotion: BOOLEAN,
      
      name: STRING.required(),
      original_price: INTEGER,
      price: INTEGER.required(),
      quota: INTEGER,
      
      status: STRING,
      subtitle: STRING,
    };
  }

  constructor(data) {
    super(data);

    const { discounts } = data;
    this.discounts = Discount.buildArray(discounts);
  }

  get couponPrice() {
    const couponDiscounts = _.filter(this.discounts, ({ extra }) => !extra);
    const totalCouponDiscounts = _.sum(_.map(couponDiscounts, 'amount'));
    return this.original_price - totalCouponDiscounts;
  }

  get finalPrice() {
    const totalDiscounts = _.sum(_.map(this.discounts, 'amount'));
    return this.original_price - totalDiscounts;
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
