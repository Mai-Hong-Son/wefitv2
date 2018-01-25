/**
 * @providesModule WeFit.Models.FirebaseConfigs
 */

import _ from 'lodash';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { STRING } = COMMON_SCHEMAS;

export default class FirebaseConfigs extends BaseModel {
  static dataValidator() {
    return {
      apiKey: STRING.required(),
      authDomain: STRING.required(),
      databaseURL: STRING.required(),
      serverKey: STRING.required(),
      storageBucket: STRING.required(),
    };
  }

  static defaultData() {
    const rawConfigs = require('app/data/configs/firebase.json');
    const variants = _.keys(rawConfigs);
    const configs = _.map(variants, variant => FirebaseConfigs.build(rawConfigs[variant]));
    return _.zipObject(variants, configs);
  }
}
