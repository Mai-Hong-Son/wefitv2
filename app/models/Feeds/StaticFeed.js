/**
 * @providesModule WeFit.Models.Feeds.StaticFeed
 */

import Joi from 'react-native-joi';

// Constants
import { FEED_TYPES } from 'redux/constants';

// Models
import BaseModel from 'app/models/BaseModel';

const { NEWCOMER, PENDING_ORDER, WEFIT_TIPS } = FEED_TYPES;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class StaticFeed extends BaseModel {
  static dataValidator() {
    return {
      payload: Joi.object().empty([null]).default({}),
      type: Joi.string().allow([NEWCOMER, PENDING_ORDER, WEFIT_TIPS]).required(),
    };
  }

  static get placeholder() {
    return StaticFeed.build({ type: WEFIT_TIPS });
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
