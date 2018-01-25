/**
 * @providesModule WeFitApp.Models.PaymentOrder
 */

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { ID, INTEGER, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class PaymentOrder extends BaseModel {
  static dataValidator() {
    return {
      checkout_url: STRING.required(),
      description: STRING,
      
      id: ID,
      membership_id: ID,
      note: STRING,
      
      payment_method: STRING,
      provider: STRING,
      subtotal_price: INTEGER,
      
      token: STRING.required(),
      total_discounts: INTEGER,
      total_price: INTEGER,
      transaction_code: STRING,
      user_id: ID,
    };
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
