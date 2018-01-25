/**
 * @providesModule WeFit.Models.Membership
 */

import I18n from 'react-native-i18n';
import moment from 'moment';

// Constants
import { DEBUGS } from 'app/constants/Flags';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

// Utils
import { formatText } from 'app/utils';

const { BOOLEAN, DATE, ID, INTEGER, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class Membership extends BaseModel {
  static dataValidator() {
    return {
      activated: BOOLEAN.required(),
      expiration_date: DATE.required(),
      expired: BOOLEAN.required(),
      finished_reservations: INTEGER.required(),
      id: ID,
      ignore_quota: BOOLEAN.required(),
      membership_type_name: STRING,
      remaining_reservations: INTEGER.required(),
      reservation_quota: INTEGER.required(),
      status: STRING,
      trial: BOOLEAN.required(),
      user_id: ID,
    };
  }

  get expireStats() {
    const {
      activated,
      expiration_date: expirationDate,
      expired,
      ignore_quota: ignore,
      remaining_reservations: remainRerservations,
    } = this;

    if (!activated) return { activated };

    const expireMoment = DEBUGS.MEMBERSHIP_WITH_QUOTA ? moment() : moment(expirationDate);
    const expireDate = expireMoment.format(I18n.t('formats.membershipDate'));
    const remain = ignore ? undefined : remainRerservations;
    const remainQuota = DEBUGS.MEMBERSHIP_WITH_QUOTA ? 5 : remain;
    return { activated, expired, expireDate, remainQuota };
  }

  get statusText() {
    const { activated, expired, trial } = this;
    if (trial) return 'trial';
    if (expired) return 'expired';
    if (activated) return 'activated';
  }

  buildExpireStatsText(templates) {
    const { hasExpired, noQuota, notActivated, quota: { plural, singular } } = templates;
    const { activated, expired, expireDate, remainQuota } = this.expireStats;

    if (!activated) return notActivated;
    if (expired) return hasExpired;
    
    if (remainQuota == null)
      return formatText(noQuota, expireDate);

    const template = remainQuota > 1 ? plural : singular;
    return formatText(template, expireDate, remainQuota);
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
