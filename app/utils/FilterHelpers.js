/**
 * @providesModule WeFit.Utils.FilterHelpers
 */

import moment from 'moment';
import _ from 'lodash';

// Constants
import { FORMATS } from 'app/constants/AppConstants';

const { DATE_ID, JSON_DATE } = FORMATS;

export function serializeDateParams(dateId) {
  if (dateId == null)
    return { client_timestamp: moment().format(JSON_DATE) };

  const startOfDay = moment(dateId, DATE_ID).startOf('day');
  const endOfDay = moment(dateId, DATE_ID).endOf('day');
  const startAt = [startOfDay, endOfDay].map(day => day.format(JSON_DATE)).join(',');

  return {
    client_timestamp: moment().format(JSON_DATE),
    date: dateId,
    start_at: startAt,
  };
}

export function hasFilters(filters) {
  const { amenities, districts, fitnessTypes, timeRanges } = filters;

  const emptyFilters =
    _.isEmpty(amenities) &&
    _.isEmpty(districts) &&
    _.isEmpty(fitnessTypes) &&
    _.isEmpty(timeRanges);

  return !emptyFilters;
}

export function serializeFilterParams(filters) {
  const { amenities, districts, fitnessTypes, timeRanges } = filters;

  const amenityParams = _.isEmpty(amenities) ? {} : {
    amenity_codes: _.map(amenities, 'code').join(),
  };
  
  const districtParams = _.isEmpty(districts) ? {} : {
    district_codes: _.map(districts, 'code').join(),
  };
  
  const fitnessTypeParams = _.isEmpty(fitnessTypes) ? {} : {
    fitness_type_codes: _.map(fitnessTypes, 'code').join(),
  };
  
  const timeRangeParams = _.isEmpty(timeRanges) ? {} : {
    time_ranges: _.map(timeRanges, 'toParams').join('|'),
  };

  return {
    ...amenityParams,
    ...districtParams,
    ...fitnessTypeParams,
    ...timeRangeParams,
  };
}
