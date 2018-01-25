/**
 * @providesModule WeFit.I18n
 */

import I18n from 'react-native-i18n';

// Constants
import { DEFAULT_LANGUAGE } from 'redux/constants';

// Locales
import en from './locales/en';
import vi from './locales/vi';

// Fallback to vi-VN
I18n.fallbacks = true;
I18n.locale = DEFAULT_LANGUAGE;

I18n.translations = { en, vi };
