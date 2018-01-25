/**
 * @providesModule WeFit.Utils.RoutersMiddleware
 * 
 * A middleware to detect short-time action dispatches
 * This will check all 'Navigation/' prefixed actions
 * which are duplicated over a short duration (`DISPATCH_THROTTLE`)
 * and prevent them to be reduced to make new states.
 */

import { Logger } from '@onaclover/react-native-utils';
import Singleton from 'singleton';
import _ from 'lodash';

// Constants
import { APP_CONFIGS } from 'app/constants/AppConstants';
import { DEBUGS } from 'app/constants/Flags';

class RoutersMiddleware extends Singleton {
  constructor() {
    super();
    this.lastActions = {};
    this.lastDispatchTimes = {};
  }

  duplicatedNavigate(action, routerName) {
    // Only watch for 'Navigation/' prefixed actions, others are allowed
    if (!_.startsWith(action.type, 'Navigation/')) return false;

    const dispatchTime = Date.now();
    const actionString = JSON.stringify(action);

    const { [routerName]: lastActionString } = this.lastActions;
    const { [routerName]: lastDispatchTime } = this.lastDispatchTimes;
    
    if (actionString === lastActionString &&
        lastDispatchTime + APP_CONFIGS.NAVIGATION_DISPATCH_THROTTLE >= dispatchTime) {
      if (DEBUGS.LOG_DUPLICATED_NAVIGATES) Logger.warn('Duplicated navigate action', action);
      return true;
    }

    this.lastActions[routerName] = actionString;
    this.lastDispatchTimes[routerName] = dispatchTime;
    return false;
  }
}

export default RoutersMiddleware.get();
