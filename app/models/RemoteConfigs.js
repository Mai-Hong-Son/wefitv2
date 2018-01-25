/**
 * @providesModule WeFit.Models.RemoteConfigs
 */

import Joi from 'react-native-joi';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { INTEGER, INTEGERS_ARRAY, OBJECT, STRING } = COMMON_SCHEMAS;
const DEFAULT_VERSION = '2.0.0';

/* eslint-disable dot-notation, newline-per-chained-call */

class Versioning extends BaseModel {
  static dataValidator() {
    return {
      build: INTEGER.default(1),
      name: STRING.default(DEFAULT_VERSION),
    };
  }
}

export default class RemoteConfigs extends BaseModel {
  static dataValidator() {
    return {
      hotline_default: STRING,
      latest_versions: Joi.object().keys({ release: OBJECT, staging: OBJECT }),
      notify_before_options: INTEGERS_ARRAY,
    };
  }

  constructor(data) {
    super(data);

    const { latest_versions: { release, staging } = {} } = this;
    this.latest_versions = {
      release: Versioning.build(release),
      staging: Versioning.build(staging),
    };
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
