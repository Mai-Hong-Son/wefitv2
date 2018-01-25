/**
 * @providesModule WeFit.Components.Reusables.Props
 */

import PropTypes from 'prop-types';
import _ from 'lodash';

// Constants
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Models
import { Amenity, District, FitnessType } from 'app/models/BaseStaticData';
import Review from 'app/models/Review';
import Session from 'app/models/Session';
import TimeRange from 'app/models/TimeRange';

const filters = PropTypes.shape({
  amenities: PropTypes.arrayOf(PropTypes.instanceOf(Amenity)).isRequired,
  districts: PropTypes.arrayOf(PropTypes.instanceOf(District)).isRequired,
  fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
  timeRanges: PropTypes.arrayOf(PropTypes.instanceOf(TimeRange)).isRequired,
});

const globalAlert = PropTypes.shape({
  icon: PropTypes.string,
  message: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.oneOf(_.values(GLOBAL_ALERT_TYPES)),
});

const goals = PropTypes.shape({
  durationBasis: PropTypes.string,
  finish: PropTypes.number,
  level: PropTypes.number,
  target: PropTypes.number,
});

const reviewsData = PropTypes.shape({
  data: PropTypes.arrayOf(PropTypes.instanceOf(Review)).isRequired,
  error: PropTypes.object,
  hasMore: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
});

const sessionsData = PropTypes.shape({
  data: PropTypes.arrayOf(PropTypes.instanceOf(Session)).isRequired,
  error: PropTypes.object,
  hasMore: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
});

export default { filters, globalAlert, goals, reviewsData, sessionsData };
