/**
 * @providesModule WeFit.Redux.Reducers.Shared.GlobalAlertReducer
 */

import I18n from 'react-native-i18n';
import _ from 'lodash';

// Constants
import { GLOBAL_ALERT_TYPES } from 'redux/constants';
import { AUTH, SERVICE_API, SHARED } from 'redux/types';

export const DEFAULT_GLOBAL_ALERT = { icon: null, message: null, title: null, type: null };

export default function globalAlertReducer(state, action) {
  const { type } = action;
  
  if (type === SHARED.CLEAR_GLOBAL_ALERT)
    return { ...state, globalAlert: DEFAULT_GLOBAL_ALERT };

  if (type === SHARED.SHOW_GLOBAL_ALERT) {
    const { payload: { message, meta, title, type } } = action;

    if (!_.isEmpty(title) && _.includes(_.values(GLOBAL_ALERT_TYPES), type))
      return { ...state, globalAlert: { message, meta, title, type } };
  }

  const { error, payload: { error: payloadError } = {} } = action;

  const { message = I18n.t('globalAlert.defaultMessage') } = error || payloadError || {};

  const {
    CONNECT_FACEBOOK, LOGIN_EMAIL, LOGIN_SOCIAL, SIGN_UP_EMAIL,
  } = AUTH;
  
  const {
    CANCEL_REVIEW, CANCEL_SESSION, CHANGE_PASSWORD, CHECK_PROMOCODE_CODE,
    FAVOR_STUDIO, FORGOT_PASSWORD,
    GET_MY_SESSIONS, GET_OVERALL_SCHEDULES, GET_STUDIO_SCHEDULES, GET_STUDIOS_MAP, LINK_REFERRAL_CODE,
    REDEEM_MEMBERSHIP, REQUEST_PAYMENT_ORDER, RESERVE_SESSION, RESET_PASSWORD, SUBMIT_REVIEW,
    UPDATE_PERSONAL_INFO, UPDATE_USER_SETTINGS, UPLOAD_AVATAR,
  } = SERVICE_API;

  let title = null;

  // Auth
  if (_.startsWith(type, CHANGE_PASSWORD)) title = I18n.t('globalAlert.auth.changePassword');
  if (_.startsWith(type, CONNECT_FACEBOOK)) title = I18n.t('globalAlert.auth.connectFacebook');
  if (_.startsWith(type, LOGIN_EMAIL)) title = I18n.t('globalAlert.auth.loginEmail');
  if (_.startsWith(type, LOGIN_SOCIAL)) title = I18n.t('globalAlert.auth.loginSocial');
  if (_.startsWith(type, SIGN_UP_EMAIL)) title = I18n.t('globalAlert.auth.signUpEmail');

  // Service APIs
  if (_.startsWith(type, CANCEL_REVIEW)) title = I18n.t('globalAlert.cancelReview');
  if (_.startsWith(type, CANCEL_SESSION)) title = I18n.t('globalAlert.cancelSession');
  if (_.startsWith(type, CHECK_PROMOCODE_CODE)) title = I18n.t('globalAlert.checkPromoCode');
  
  if (_.startsWith(type, FAVOR_STUDIO)) title = I18n.t('globalAlert.favorStudio');
  if (_.startsWith(type, FORGOT_PASSWORD)) title = I18n.t('globalAlert.forgotPassword');

  if (_.startsWith(type, GET_MY_SESSIONS)) title = I18n.t('globalAlert.mySessions');
  if (_.startsWith(type, GET_OVERALL_SCHEDULES)) title = I18n.t('globalAlert.overallSchedules');
  if (_.startsWith(type, GET_STUDIO_SCHEDULES)) title = I18n.t('globalAlert.studioSchedules');
  if (_.startsWith(type, GET_STUDIOS_MAP)) title = I18n.t('globalAlert.studiosMap');
  if (_.startsWith(type, LINK_REFERRAL_CODE)) title = I18n.t('globalAlert.linkReferralCode');
  
  if (_.startsWith(type, REDEEM_MEMBERSHIP)) title = I18n.t('globalAlert.redeemMembership');
  if (_.startsWith(type, REQUEST_PAYMENT_ORDER)) title = I18n.t('globalAlert.requestPaymentOrder');
  if (_.startsWith(type, RESERVE_SESSION)) title = I18n.t('globalAlert.reserveSession');
  if (_.startsWith(type, RESET_PASSWORD)) title = I18n.t('globalAlert.resetPassword');

  if (_.startsWith(type, SUBMIT_REVIEW)) title = I18n.t('globalAlert.submitReview');
  if (_.startsWith(type, UPDATE_PERSONAL_INFO)) title = I18n.t('globalAlert.updatePersonalInfo');
  if (_.startsWith(type, UPDATE_USER_SETTINGS)) title = I18n.t('globalAlert.updateUserSettings');
  if (_.startsWith(type, UPLOAD_AVATAR)) title = I18n.t('globalAlert.uploadAvatar');

  if (title == null) return state;
  return { ...state, globalAlert: { message, title, type: GLOBAL_ALERT_TYPES.ERROR } };
}
