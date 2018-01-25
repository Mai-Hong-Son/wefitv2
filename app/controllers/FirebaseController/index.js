/**
 * @providesModule WeFit.Controllers.FirebaseController
 */

/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import PropTypes from 'prop-types';
import { AppState, Platform } from 'react-native';
import FCM, { FCMEvent } from 'react-native-fcm';
import { DeviceUtils, Logger } from '@onaclover/react-native-utils';
import Firebase from 'firebase';
import _ from 'lodash';

// Constants
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { FEATURES } from 'app/constants/Flags';
import { GLOBAL_ALERT_TYPES, FCM_NOTIFICATION_KEYS, FCM_NOTIFICATION_TYPES } from 'redux/constants';

// Models
import FirebaseConfigs from 'app/models/FirebaseConfigs';
import Session from 'app/models/Session';

// Locals
import BaseController from '../BaseController';
import withConnect from './withConnect';

const { APNS, FCM_ANDROID, OPENED_FROM_TRAY, PAYLOAD, TYPE } = FCM_NOTIFICATION_KEYS;
const { CHECKED_IN, LONG_TIME_INACTIVE, NOTIF_ARTICLE, STUDIO_UPDATE } = FCM_NOTIFICATION_TYPES;
const { INFO, SUCCESS } = GLOBAL_ALERT_TYPES;
const { MY_SESSIONS, OVERALL_SCHEDULES } = MAIN_ROUTES;

@withConnect
export default class FirebaseController extends BaseController {
  static propTypes = {
    authToken: PropTypes.string,
    clearFilters: PropTypes.func.isRequired,
    fcmToken: PropTypes.string,
    navigateArticle: PropTypes.func.isRequired,
    navigateMainTab: PropTypes.func.isRequired,
    navigateSession: PropTypes.func.isRequired,
    navigateStudio: PropTypes.func.isRequired,
    receiveNotification: PropTypes.func.isRequired,
    refreshToken: PropTypes.func.isRequired,
    registerDevice: PropTypes.func.isRequired,
    rehydrated: PropTypes.bool.isRequired,
    revokeDevice: PropTypes.func.isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
  };

  static defaultProps = {
    authToken: null,
    fcmToken: null,
  };

  constructor(props) {
    super(props);

    this.clearFilters = this.props.clearFilters.bind(this);
    this.navigateArticle = this.props.navigateArticle.bind(this);
    this.navigateMainTab = this.props.navigateMainTab.bind(this);
    this.navigateSession = this.props.navigateSession.bind(this);
    this.navigateStudio = this.props.navigateStudio.bind(this);
    this.receiveNotification = this.props.receiveNotification.bind(this);
    this.refreshToken = this.props.refreshToken.bind(this);
    this.registerDevice = this.props.registerDevice.bind(this);
    this.revokeDevice = this.props.revokeDevice.bind(this);
    this.showGlobalAlert = this.props.showGlobalAlert.bind(this);
    
    this.initFirebaseApp();

    if (FEATURES.GLOBAL_MODULES) global.FirebaseController = this;
  }

  componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChanged);

    // Add some extra handlings before dispatch `receiveNotification` action
    FCM.on(FCMEvent.Notification, this.onReceiveRawNotif);

    // Directly dispatch received token to Redux store
    FCM.on(FCMEvent.RefreshToken, this.refreshToken);

    // Clear badge count
    FCM.setBadgeNumber(0);
  }
  
  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChanged);
  }

  componentWillReceiveProps(nextProps) {
    const { authToken, rehydrated } = this.props;
    const { authToken: nextAuthToken, fcmToken, rehydrated: nextRehydrated } = nextProps;

    if (!rehydrated && nextRehydrated)
      this.requestFcmToken();

    if (authToken !== nextAuthToken) {
      if (nextAuthToken != null)
        this.registerDevice(fcmToken);
      else
        this.revokeDevice(authToken, fcmToken);
    }
  }

  initFirebaseApp = () => {
    if (!_.isEmpty(Firebase.apps)) return;
    
    try {
      const { variant } = DeviceUtils.buildInfo;
      const configs = FirebaseConfigs.defaultData();
      Firebase.initializeApp(configs[variant]);
    } catch (error) { Logger.warn(error); }
  }

  // Clear badge count
  onAppStateChanged = nextAppState => (nextAppState === 'active' && FCM.setBadgeNumber(0));

  onReceiveCheckedInNotif = ({ message, openedFromTray, payload, title }) => {
    const session = Session.build(payload);
    const meta = { payload: session, type: CHECKED_IN };
    
    if (openedFromTray)
      this.navigateSession({ session, variant: MY_SESSIONS });
    else {
      this.showGlobalAlert({ message, meta, title, type: SUCCESS });
      this.receiveNotification(meta);
    }
  };

  onReceiveLongTimeInactiveNotif = ({ message, openedFromTray, title }) => {
    const meta = { type: LONG_TIME_INACTIVE };

    if (openedFromTray) {
      this.navigateMainTab(OVERALL_SCHEDULES);
      this.clearFilters();
    } else
      this.showGlobalAlert({ message, meta, title, type: INFO });
  };

  onReceiveNewArticleNotif = ({ message, openedFromTray, payload, title }) => {
    const meta = { payload, type: NOTIF_ARTICLE };
    
    if (openedFromTray) {
      this.navigateArticle(payload);
    } else {
      this.showGlobalAlert({ message, meta, title, type: INFO });
      this.receiveNotification(meta);
    }
  };

  onReceiveStudioUpdateNotif = ({ message, openedFromTray, payload, title }) => {
    const { redirect_to_maps: redirectToMaps, studio_id: studioId } = payload;
    const meta = { payload: { redirectToMaps, studioId }, type: STUDIO_UPDATE };
    
    if (openedFromTray)
      this.navigateStudio({ redirectToMaps, studioId });
    else
      this.showGlobalAlert({ message, meta, title, type: INFO });
  };

  onReceiveRawNotif = rawNotif => {
    const {
      [OPENED_FROM_TRAY]: rawOpenFromTray,
      [PAYLOAD]: rawPayload,
      [TYPE]: type,
    } = rawNotif;

    const notifKey = Platform.select({ android: FCM_ANDROID, ios: APNS });
    const { [notifKey]: notification } = rawNotif;
    const { body: message, title } = notification.alert || notification || {};

    const openedFromTray = rawOpenFromTray === 1;
    const payload = {};
    try {
      Object.assign(payload, JSON.parse(rawPayload));
    } catch (error) {
      Logger.debug(error);
    }

    const params = { message, openedFromTray, payload, title };
    
    Logger.debug({ rawNotif, openedFromTray, payload, type, params });

    // User not authenticated yet
    if (_.isEmpty(this.props.authToken)) {
      if (!openedFromTray) this.showGlobalAlert({ message, title, type: INFO });
      return;
    }

    switch (type) {
      case CHECKED_IN: this.onReceiveCheckedInNotif(params); return;
      case LONG_TIME_INACTIVE: this.onReceiveLongTimeInactiveNotif(params); return;
      case STUDIO_UPDATE: this.onReceiveStudioUpdateNotif(params); return;
      case NOTIF_ARTICLE: this.onReceiveNewArticleNotif(params); return;
      default: if (!openedFromTray) this.showGlobalAlert({ message, title, type: INFO }); return;
    }
  };

  requestFcmToken = async () => {
    try {
      await FCM.requestPermissions(); // for iOS
      const fcmToken = await FCM.getFCMToken();
      this.refreshToken(fcmToken);
    } catch (error) { Logger.warn(error); }
  };
}
