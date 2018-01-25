/**
 * @providesModule WeFit.Controllers.UserDataController
 */

/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';
import { Logger } from '@onaclover/react-native-utils';
import moment from 'moment';

// Moment locales
import 'moment/locale/en-ie';
import 'moment/locale/vi';

// Constants
import { FEATURES } from 'app/constants/Flags';

// Models
import User from 'app/models/User';

// Utils
import { requestLocation } from 'app/utils';

// Locals
import BaseController from '../BaseController';
import withConnect from './withConnect';

moment.updateLocale('vi', {
  weekdaysShort : ['C. Nhật', 'T. Hai', 'T. Ba', 'T. Tư', 'T. Năm', 'T. Sáu', 'T. Bảy'],
});

@withConnect
export default class UserDataController extends BaseController {
  static propTypes = {
    changeLanguage: PropTypes.func.isRequired,
    getUserData: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    rehydrated: PropTypes.bool.isRequired,
    requestUserLocation: PropTypes.func.isRequired,
    userData: PropTypes.instanceOf(User),
  };

  static defaultProps = {
    userData: null,
  };

  constructor(props) {
    super(props);

    this.changeLanguage = this.props.changeLanguage.bind(this);
    this.getUserData = this.props.getUserData.bind(this);
    this.requestUserLocation = this.props.requestUserLocation.bind(this);

    if (FEATURES.GLOBAL_MODULES) global.UserDataController = this;
  }

  componentWillReceiveProps(nextProps) {
    const { language, rehydrated, userData } = this.props;
    const {
      language: nextLanguage,
      rehydrated: nextRehydrated,
      userData: nextUserData,
    } = nextProps;

    const { settings: { language: settingsLanguage } = {} } = nextUserData || {};

    if (!rehydrated && nextRehydrated) {
      this.applyLanguageChange(settingsLanguage || nextLanguage);

      if (nextUserData != null) {
        this.getUserData();
        this.requestUserLocation(requestLocation);
      }
    }

    if (userData !== nextUserData && nextUserData != null) {
      this.changeLanguage(settingsLanguage);
      this.requestUserLocation(requestLocation);
    }
    
    if (language !== nextLanguage)
      this.applyLanguageChange(nextLanguage);
  }

  applyLanguageChange = language => {
    I18n.locale = language;
    moment.locale(language);
    Logger.log(`User has changed language to ${I18n.currentLocale()}`);
  };
}
