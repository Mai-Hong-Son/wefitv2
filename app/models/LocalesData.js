/**
 * @providesModule WeFit.Models.LocalesData
 */

import I18n from 'react-native-i18n';
import { SearchUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { DEFAULT_LANGUAGE } from 'redux/constants';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { OBJECT } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class LocalesData extends BaseModel {
  static dataValidator() {
    return {
      en: OBJECT,
      vi: OBJECT.required(),
    };
  }

  constructor(data) {
    super(data);

    _.each(data, locales => {
      const { name } = locales;
      
      if (!_.isEmpty(name))
        locales.sanitized_name = SearchUtils.sanitize(name);
    });
  }

  get translated() {
    const currentLocale = I18n.currentLocale();
    const { [currentLocale]: localeData, [DEFAULT_LANGUAGE]: defaultData } = this;
    return localeData || defaultData;
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
