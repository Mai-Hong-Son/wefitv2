/**
 * @providesModule WeFit.Components.AppNavigator.GlobalAlert
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import Props from 'app/components/Reusables/Props';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { GLOBAL_ALERT_TYPES, FCM_NOTIFICATION_TYPES } from 'redux/constants';

// Locals
import withConnect from './withConnect';

const { MY_SESSIONS, OVERALL_SCHEDULES } = MAIN_ROUTES;
const { CHECKED_IN, LONG_TIME_INACTIVE, NOTIF_ARTICLE, STUDIO_UPDATE } = FCM_NOTIFICATION_TYPES;
const TAP_ACTION = 'tap';

@withConnect
export default class GlobalAlert extends React.PureComponent {
  static propTypes = {
    clearFilters: PropTypes.func.isRequired,
    clearGlobalAlert: PropTypes.func.isRequired,
    globalAlert: Props.globalAlert.isRequired,
    navigateArticle: PropTypes.func.isRequired,
    navigateMainTab: PropTypes.func.isRequired,
    navigateSession: PropTypes.func.isRequired,
    navigateStudio: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.clearFilters = this.props.clearFilters.bind(this);
    this.clearGlobalAlert = this.props.clearGlobalAlert.bind(this);
    this.navigateArticle = this.props.navigateArticle.bind(this);
    this.navigateMainTab = this.props.navigateMainTab.bind(this);
    this.navigateSession = this.props.navigateSession.bind(this);
    this.navigateStudio = this.props.navigateStudio.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { globalAlert } = this.props;
    const { globalAlert: prevGlobalAlert } = prevProps;

    if (globalAlert !== prevGlobalAlert) {
      const { message, title, type } = globalAlert;
      const hasContent = !_.isEmpty(title) || !_.isEmpty(message);

      if (hasContent && _.includes(GLOBAL_ALERT_TYPES, type))
        this.alertView.alertWithType(type, title || '', message || '');
    }
  }

  onClose = ({ action }) => {
    const { globalAlert: { meta } } = this.props;

    if (meta == null || action !== TAP_ACTION) {
      this.clearGlobalAlert();
      return;
    }

    const { payload, type } = meta;

    switch (type) {
      case CHECKED_IN: this.navigateSession({ session: payload, variant: MY_SESSIONS }); break;
      
      case LONG_TIME_INACTIVE: {
        this.navigateMainTab(OVERALL_SCHEDULES);
        this.clearFilters();
        break;
      }
      case NOTIF_ARTICLE: this.navigateArticle(payload); break;
      case STUDIO_UPDATE: this.navigateStudio(payload); break;

      default: break;
    }

    this.clearGlobalAlert();
  };

  render() {
    return (
      <DropdownAlert
        containerStyle={styles.customStyle}
        inactiveStatusBarBackgroundColor="transparent"
        inactiveStatusBarStyle="light-content"
        infoColor={COLORS.PURPLE}
        messageStyleStyle={styles.message}
        onClose={this.onClose}
        ref={ref => this.alertView = ref}
        successColor={COLORS.FACEBOOK}
        titleStyle={styles.title}
        translucent
        warnColor={COLORS.STARS}
      />
    );
  }
}

const styles = StyleSheet.create({
  customStyle: {
    backgroundColor: COLORS.PINK,
  },
  message: FontUtils.build({
    color: 'white',
  }),
  title: FontUtils.build({
    color: 'white',
    size: 17,
    weight: 'semibold',
  }),
});
