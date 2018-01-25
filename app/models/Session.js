/**
 * @providesModule WeFit.Models.Session
 */

import Joi from 'react-native-joi';
import moment from 'moment';
import _ from 'lodash';

// Constants
import { DUMMY, FORMATS } from 'app/constants/AppConstants';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';
import DisplayAmenity from 'app/models/DisplayAmenity';
import GalleryItem from 'app/models/GalleryItem';

import { formatText } from 'app/utils';

const { BOOLEAN, DATE, FLOAT, ID, INTEGER, OBJECTS_ARRAY, STRING, STRINGS_ARRAY } = COMMON_SCHEMAS;
const { EMPTY_DATA } = DUMMY;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class Session extends BaseModel {
  static dataValidator() {
    return {
      amenities: OBJECTS_ARRAY,
      available_slots: INTEGER,

      checked_in: BOOLEAN,
      course_id: ID,
      current_order: INTEGER,
      
      description: STRING,
      end_at: DATE.required(),
      gallery_items: OBJECTS_ARRAY,

      id: ID,
      image_link: STRING,
      instructor_name: STRING,
      is_available: BOOLEAN,
      is_cancellable: BOOLEAN,
      is_enabled: BOOLEAN,
      is_reserved: BOOLEAN,
      
      level: STRING,
      name: STRING.required(),
      pro_tips: STRINGS_ARRAY,
      
      rating_score: FLOAT,
      rating_scores: Joi.object().keys({ 1: FLOAT, 2: FLOAT, 3: FLOAT, 4: FLOAT, 5: FLOAT }),
      requirements: STRINGS_ARRAY,
      reservation_code: STRING,
      reservation_errors: STRINGS_ARRAY,
      
      show_up_policies: STRINGS_ARRAY,
      start_at: DATE.required(),
      studio_id: ID,
      
      total_sessions: INTEGER,
      type_codes: STRINGS_ARRAY,
    };
  }

  static get emptySession() {
    return this.build({
      course_id: 0,
      id: 0,
      name: EMPTY_DATA,
      studio_id: 0,
    });
  }

  constructor(data) {
    super(data);

    const { amenities, gallery_items: galleryItems, requirements, show_up_policies: showUpPolicies, types } = data;
    this.amenities = DisplayAmenity.buildArray(amenities);
    this.gallery_items = GalleryItem.buildArray(galleryItems);
    this.requirements = _.compact(requirements);
    this.show_up_policies = _.compact(showUpPolicies);
    this.types = _.compact(types);
  }
  
  get currentSessionOrder() {
    if (this.total_sessions <= 0 || this.current_order <= 0 || this.current_order > this.total_sessions)
      return null;

    return `${this.current_order}/${this.total_sessions}`;
  }

  get duration() { return this.endMoment.diff(this.startMoment, 'minutes'); }
  get endMoment() { return moment(this.end_at); }
  get isEmpty() { return this.name === EMPTY_DATA; }
  
  get ratingStatus() {
    const { rating_score: score, rating_scores: scoresTable } = this;
    const count = _.sum(_.values(scoresTable));
    return { count, score, scoresTable };
  }

  get reservationCode() { return this.reservation_code; }

  get reservationErrors() {
    const { reservation_errors: errors } = this;
    if (_.isEmpty(errors)) return null;
    return errors.join('\n');
  }

  get startMoment() { return moment(this.start_at); }
  get startHour() { return this.startMoment.format(FORMATS.TIME); }

  buildEtaText(template) {
    const {
      hours: { plural: hoursPlural, singular: hoursSingular },
      minutes: { plural: minutesPlural, singular: minutesSingular },
    } = template;
    
    const now = moment();
    const hours = this.startMoment.diff(now, 'hours');
    const minutes = this.startMoment.diff(now, 'minutes') % 60;

    if (hours <= 0 && minutes <= 0) return null;

    const hoursTemplate = hours > 1 ? hoursPlural : hoursSingular;
    const minutesTemplate = minutes > 1 ? minutesPlural : minutesSingular;

    const components = _.compact([
      hours > 0 && formatText(hoursTemplate, hours),
      minutes > 0 && formatText(minutesTemplate, minutes),
    ]);

    return components.join(' ');
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
