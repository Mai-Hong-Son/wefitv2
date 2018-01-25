/**
 * @providesModule WeFit.Models.TimeRange
 */

import Joi from 'react-native-joi';

// Constants
import { DUMMY } from 'app/constants/AppConstants';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { BOOLEAN, ID, STRING } = COMMON_SCHEMAS;
const { EMPTY_DATA } = DUMMY;

export const toMinutes = hhmm => {
  const [hh, mm] = hhmm.split(':');
  return parseInt(hh) * 60 + parseInt(mm);
};
export const toTimePair = minutes => [Math.floor(minutes / 60), minutes % 60];
export const zeroPadding = num => (num < 10 ? `0${num}` : `${num}`);

const DEFAULT_START_TIME = '05:00';
const DEFAULT_END_TIME = '22:00';
const DEFAULT_START_MINUTES = toMinutes(DEFAULT_START_TIME);
const DEFAULT_END_MINUTES = toMinutes(DEFAULT_END_TIME);
const MIN_STEP_MINUTES = 30;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class TimeRange extends BaseModel {
  static dataValidator(): Object {
    return {
      id: ID,
      is_default: BOOLEAN,
      end_time: STRING.required(),
      max_level: Joi.number().default(100),
      min_level: Joi.number().default(0),
      start_time: STRING,
    };
  }

  static get defaultRanges() {
    return TimeRange.buildArray([
      { id: 1, is_default: true, end_time: '10:00', start_time: '05:00' },
      { id: 2, is_default: true, end_time: '14:30', start_time: '10:00' },
      { id: 3, is_default: true, end_time: '17:00', start_time: '14:30' },
      { id: 4, is_default: true, end_time: '22:00', start_time: '17:00' },
    ]);
  }

  static buildCustomData() {
    return TimeRange.build({ id: Date.now(), end_time: '22:00', start_time: '05:00' });
  }

  static fromPercentages({ max, min }) {
    const minutesRange = DEFAULT_END_MINUTES - DEFAULT_START_MINUTES;
    
    const startMinutes = Math.round(minutesRange * min / 100 / MIN_STEP_MINUTES) * MIN_STEP_MINUTES;
    const [startHH, startMM] = toTimePair(DEFAULT_START_MINUTES + startMinutes);
    const startTime = `${zeroPadding(startHH)}:${zeroPadding(startMM)}`;
    
    const endMinutes = Math.round(minutesRange * max / 100 / MIN_STEP_MINUTES) * MIN_STEP_MINUTES;
    const [endHH, endMM] = toTimePair(DEFAULT_START_MINUTES + endMinutes);
    const endTime = `${zeroPadding(endHH)}:${zeroPadding(endMM)}`;

    return TimeRange.build({
      end_time: endTime,
      start_time: startTime,
      id: Date.now(),
      max_level: max,
      min_level: min,
    });
  }

  get atFullRange() {
    return this.start_time === DEFAULT_START_TIME && this.end_time === DEFAULT_END_TIME;
  }
  get isEmpty() { return this.end_time === EMPTY_DATA || this.start_time === EMPTY_DATA; }
  get name() { return [this.start_time, this.end_time].join(' - '); }
  get toParams() { return [this.start_time, this.end_time].join(); }
}

/* eslint-enable dot-notation, newline-per-chained-call */
