/**
 * @providesModule WeFitApp.Utils.CalendarUtils
 */

import { Alert, Platform } from 'react-native';
import Communications from 'react-native-communications';
import CalendarEvents from 'react-native-calendar-events';
import I18n from 'react-native-i18n';
import { Logger } from '@onaclover/react-native-utils';
import Singleton from 'singleton';
import moment from 'moment';
import _ from 'lodash';

// Constants
import { FORMATS } from 'app/constants/AppConstants';

/**
 * Default 2 alarms:
 *  - First one starts before event 2 hours
 *  - Second one starts before event 30 minutes
 */
export const DEFAULT_ALARMS = [{ date: -60 * 2 }, { date: -30 }];

class CalendarUtils extends Singleton {
  async authorize() {
    try {
      const status = await CalendarEvents.authorizationStatus();

      if (status === 'undetermined')
        await CalendarEvents.authorizeEventStore();

      if (status === 'denied') {
        this.authorizeFailed();
        return false;
      }

      return true;
    } catch (error) { throw error; }
  }

  authorizeFailed() {
    const buttons = Platform.select({
      ios: [
        {
          onPress: () => Communications.web('app-settings:'),
          text: I18n.t('alerts.calendarsUnauthorized.navigateSettings'),
        },
      ],
    });

    const { message, title } = I18n.t('alerts.calendarsUnauthorized');
    Alert.alert(title, message, buttons);
  }

  async addToCalendar({ location, notes, timeRange, title }) {
    try {
      const time = this.toCalendarTimeRange(timeRange);
      const eventExisted = await this.checkEventExisted({ location, notes, title, ...time });

      // No saved event exists
      if (!eventExisted)
        await CalendarEvents.saveEvent(title, { location, notes, ...time, alarms: DEFAULT_ALARMS });
    } catch (error) { throw error; }
  }

  async checkEventExisted(configs) {
    try {
      const { location, title, endDate, startDate } = configs;
      const allEvents = await CalendarEvents.fetchAllEvents(startDate, endDate);
      
      // Note that the order of attributes is very important
      const configsValue = JSON.stringify({ location, title, endDate, startDate });

      const allEventsValues = _.map(allEvents, ({ endDate, location, startDate, title }) => {
        const time = this.toCalendarTimeRange({ endDate, startDate });
        return JSON.stringify({ location, title, ...time });
      });

      return allEventsValues.indexOf(configsValue) !== -1;
    } catch (error) {
      Logger.debug(error);
      // Return false here because there's no event in this time range
      // Referenced: https://github.com/wmcmahan/react-native-calendar-events/issues/72
      return false;
    }
  }

  toCalendarTimeRange({ endDate, startDate }) {
    const endMoment = moment(endDate);
    const startMoment = moment(startDate);

    return {
      endDate: endMoment.utc().format(FORMATS.JSON_DATE_ISO),
      startDate: startMoment.utc().format(FORMATS.JSON_DATE_ISO),
    };
  }
}

export default CalendarUtils.get();
