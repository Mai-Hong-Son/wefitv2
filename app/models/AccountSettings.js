/**
 * @providesModule WeFit.Models.AccountSettings
 */

// Constants
import { DEFAULT_LANGUAGE } from 'redux/constants';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { BOOLEAN, INTEGERS_ARRAY, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class AccountSettings extends BaseModel {
  static dataValidator() {
    return {
      hide_unavailable_sessions: BOOLEAN,
      language: STRING.default(DEFAULT_LANGUAGE),
      notify_before: INTEGERS_ARRAY,
    };
  }

  static get defaultData() {
    return AccountSettings.build({
      hide_unavailable_sessions: false,
      language: DEFAULT_LANGUAGE,
      notify_before: [],
    });
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
