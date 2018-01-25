/**
 * @providesModule WeFit.Models.BaseModel
 */

import Joi from 'react-native-joi';
import { Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

function normalizedData(data, validatorList) {
  if (_.isEmpty(data))
    return {
      error: Error(`${this.name} model constructed with empty data`),
      normalized: {},
    };
  const attributes = Object.keys(validatorList);
  const validator = Joi.object().keys(validatorList);

  const filteredData = _.pick(data, attributes);
  const { error, value } = Joi.validate(filteredData, validator);

  const normalized = error != null ? filteredData : value;
  return { error, normalized };
}

/* eslint-disable dot-notation, newline-per-chained-call */

const BOOLEAN = Joi.boolean().empty(['', null]).default(false);
const DATE = Joi.date().empty(['', null]);
const FLOAT = Joi.number().min(0).empty(['', null]).default(0);
const INTEGER = Joi.number().integer().min(0).default(0);
const OBJECT = Joi.object().empty([{}, null]);
const STRING = Joi.string().empty(['', null]);

export const COMMON_SCHEMAS = {
  BOOLEAN,
  DATE,
  FLOAT,
  INTEGER,
  OBJECT,
  STRING,
  ID: INTEGER.required(),
  INTEGERS_ARRAY: Joi.array().items(INTEGER).empty([null]).default([]),
  OBJECTS_ARRAY: Joi.array().items(OBJECT).empty([null]).default([]),
  STRINGS_ARRAY: Joi.array().items(STRING).empty([null]).default([]),
};

export default class BaseModel {
  static dataValidator() {
    // Raise error if this method is absent from descendant class
    throw new Error('[BaseModel]: dataValidator() function must be provided');
  }

  static build(data) {
    const { error, normalized } = normalizedData(data, this.dataValidator());

    if (_.isEmpty(normalized)) {
      // Logger.warn(error.message);
      return null;
    }

    if (error != null) {
      Logger.warn(`Validation failed for ${this.name} model with error & value:`, error, data);
      return null;
    }

    return new (this)(normalized);
  }

  static construct(data) {
    // Ignore errors
    const { normalized } = normalizedData(data, this.dataValidator());
    return new (this)(normalized);
  }

  static buildArray(dataArr) {
    if (_.isEmpty(dataArr)) return [];

    const models = dataArr.map(data => this.build(data));
    return _.compact(models);
  }

  static buildDict(dataArr, key = 'id') {
    if (_.isEmpty(dataArr)) return {};

    const areModelObjects = dataArr[0].constructor.name === this.name;
    
    const allData = areModelObjects ? dataArr : this.buildArray(dataArr);
    const allIds = _.map(allData, key);
    return _.zipObject(allIds, allData);
  }

  constructor(data) {
    Object.assign(this, data);
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
