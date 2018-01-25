/**
 * @providesModule WeFit.Models.Studio
 */

import Joi from 'react-native-joi';

// Constants
import { DUMMY } from 'app/constants/AppConstants';

// Models
import { COMMON_SCHEMAS } from 'app/models/BaseModel';
import BaseStaticData from 'app/models/BaseStaticData';
import GalleryItem from 'app/models/GalleryItem';
import Location from 'app/models/Location';
import _ from 'lodash';

const { BOOLEAN, FLOAT, ID, OBJECT, OBJECTS_ARRAY, STRING, STRINGS_ARRAY } = COMMON_SCHEMAS;
const { EMPTY_DATA } = DUMMY;

/* eslint-disable camelcase, dot-notation, newline-per-chained-call */

export default class Studio extends BaseStaticData {
  static dataValidator() {
    const { locales, name } = super.dataValidator();

    return {
      locales,
      name,
      
      brand_id: ID,
      city: STRING,
      city_code: STRING,
      
      district: STRING,
      fitness_type_codes: STRINGS_ARRAY,
      
      gallery_items: OBJECTS_ARRAY,
      id: ID,
      image_link: STRING,
      is_enabled: BOOLEAN,

      location: OBJECT,
      logo_link: STRING,
      phone: STRING,

      rating_score: FLOAT,
      rating_scores: Joi.object().keys({ 1: FLOAT, 2: FLOAT, 3: FLOAT, 4: FLOAT, 5: FLOAT }),

      website: STRING,
    };
  }

  static buildIndices(dataArr) {
    const byBrandIdPairs = _.map(dataArr, (studios, cityCode) => {
      const indices = {};
      _.each(studios, ({ brand_id: brandId }, index) => {
        if (indices[brandId] == null) indices[brandId] = [];
        indices[brandId].push(`${cityCode}.${index}`);
      });
      return [cityCode, indices];
    });
    
    const studioByBrandIndices = _.fromPairs(byBrandIdPairs);

    const byIdPairs = _.flatMap(dataArr, (studios, cityCode) => (
      _.map(studios, ({ id }, index) => [id, `${cityCode}.${index}`])
    ));
    const studioIndices = _.fromPairs(byIdPairs);
    return { studioByBrandIndices, studioIndices };
  }

  static findById(dataArr, indices, id) {
    const { [id]: indexPath } = indices;
    return _.get(dataArr, indexPath);
  }

  constructor(data) {
    super(data);

    const {
      amenities, fitness_types, gallery_items, location, requirements, show_up_policies,
    } = data;
    
    this.amenities = _.compact(amenities);
    this.fitness_types = _.compact(fitness_types);
    this.gallery_items = GalleryItem.buildArray(gallery_items);
    this.location = Location.build(location);
    this.requirements = _.compact(requirements);
    this.show_up_policies = _.compact(show_up_policies);
  }

  get address() { return this.translate('address'); }
  get description() { return this.translate('description'); }
  get isEmpty() { return this.name === EMPTY_DATA; }
  get navigation_tip() { return this.translate('navigation_tip'); }
  get pro_tips() { return this.translate('pro_tips'); }

  get ratingStatus() {
    const { rating_score: score, rating_scores: scoresTable } = this;
    const count = _.sum(_.values(scoresTable));
    return { count, score, scoresTable };
  }
  
  get requirements() { return this.translate('requirements'); }
  get sanitized_name() { return this.translate('sanitized_name'); }
  get short_address() { return this.translate('short_address'); }
  get show_up_policies() { return this.translate('show_up_policies'); }
}

/* eslint-enable camelcase, dot-notation, newline-per-chained-call */
