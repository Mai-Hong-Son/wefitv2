/**
 * @providesModule WeFit.Models.BaseStaticData
 */

import _ from 'lodash';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';
import LocalesData from 'app/models/LocalesData';

const { BOOLEAN, ID, OBJECT, STRING } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class BaseStaticData extends BaseModel {
  static dataValidator() {
    return {
      city_code: STRING,
      code: STRING.required(),
      id: ID,
      locales: OBJECT,
      name: STRING,
    };
  }

  static buildIndices(dataArr) {
    const pairs = _.map(dataArr, ({ code }, index) => [code, index]);
    return _.fromPairs(pairs);
  }

  static filterByCodes(dataArr, indices, codes) {
    const filteredIndices = _.values(_.pick(indices, codes));
    return _.map(filteredIndices, index => dataArr[index]);
  }

  static findById(dataArr, indices, id) {
    const { [id]: indexPath } = indices;
    return _.get(dataArr, indexPath);
  }

  constructor(data) {
    super(data);

    const { locales } = data;
    this.locales = LocalesData.build(locales);
  }

  translate(attrName) {
    const { translated } = this.locales || {};
    const { [attrName]: textValue } = translated || {};
    return textValue;
  }

  get name() { return this.translate('name'); }
}

export class Amenity extends BaseStaticData {
  static dataValidator() {
    return {
      ...super.dataValidator(),
      filterable: BOOLEAN,
    };
  }
}

export class City extends BaseStaticData {}
export class District extends BaseStaticData {}
export class FitnessType extends BaseStaticData {}

/* eslint-enable dot-notation, newline-per-chained-call */
