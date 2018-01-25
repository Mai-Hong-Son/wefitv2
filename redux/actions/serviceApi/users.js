/**
 * @providesModule WeFit.Redux.Actions.ServiceApi.Users
 */

import { createAction } from 'redux-actions';

// Constants
import { SERVICE_API } from 'redux/types';
import { DEBUGS } from 'redux/flags';

// Models
import Membership from 'app/models/Membership';
import Referral from 'app/models/Referral';
import User from 'app/models/User';

// Utils
import { buildHeaders } from 'redux/utils';

export const resetAvatarUpload = createAction(SERVICE_API.RESET_AVATAR_UPLOAD);

export function changePassword({ newPassword, password }) {
  const action = createAction(SERVICE_API.CHANGE_PASSWORD);
  const dataKey = 'changePasswordRequest';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      data: { new_password: newPassword, old_password: password },
      headers: buildHeaders(state, { apiVersion: 'v2' }),
      method: 'post',
      transformResponse: ({ result }) => User.build(result),
      url: `/users/${userId}/change_password`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function forgotPassword(email) {
  const action = createAction(SERVICE_API.FORGOT_PASSWORD);
  const dataKey = 'forgotPasswordRequest';
  
  return (dispatch, getState) => {
    const request = {
      data: { email },
      headers: buildHeaders(getState(), { apiVersion: 'v2' }),
      method: 'post',
      url: '/forgot_password',
    };

    dispatch(action({ dataKey, request }));
  };
}

export function getUserData() {
  const action = createAction(SERVICE_API.GET_USER_DATA);
  const dataKey = 'userDataUpdate';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      headers: buildHeaders(state),
      transformResponse: ({ result }) => User.build(result),
      url: `/users/${userId}/me`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function getUserReferrals() {
  const action = createAction(SERVICE_API.GET_USER_REFERRALS);
  const dataKey = 'userReferrals';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      headers: buildHeaders(state),
      transformResponse: ({ result }) => Referral.build(result),
      url: `/users/${userId}/referral`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function linkReferralCode(referralCode) {
  const action = createAction(SERVICE_API.LINK_REFERRAL_CODE);
  const dataKey = 'referralCodeLinking';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      data: { referral_code: referralCode },
      headers: buildHeaders(state),
      method: 'post',
      transformResponse: ({ result }) => Referral.build(result),
      url: `/users/${userId}/link_to`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function resetPassword({ newPassword, verificationCode }) {
  const action = createAction(SERVICE_API.RESET_PASSWORD);
  const dataKey = 'resetPasswordRequest';
  
  return (dispatch, getState) => {
    const request = {
      data: { code: verificationCode, new_password: newPassword },
      headers: buildHeaders(getState(), { apiVersion: 'v2' }),
      method: 'post',
      url: '/reset_password',
    };

    dispatch(action({ dataKey, request }));
  };
}

export function startTrial() {
  const action = createAction(SERVICE_API.START_TRIAL);
  const dataKey = 'trialStart';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      data: { trial: true },
      headers: buildHeaders(state),
      method: 'put',
      transformResponse: ({ result }) => Membership.build(result),
      url: `/users/${userId}/membership`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function updatePersonalInfo(infoData) {
  const action = createAction(SERVICE_API.UPDATE_PERSONAL_INFO);
  const dataKey = 'personalInfo';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { city_code: currentCity, id: userId } } } = state;
    const { city_code: newCity, birthday, email, gender, name, phone } = infoData;
    
    const switchCity = newCity != null && currentCity !== newCity;

    const request = {
      data: { birthday, email, gender, name, phone, city_code: newCity },
      headers: buildHeaders(state),
      method: 'put',
      transformResponse: ({ result }) => User.build(result),
      url: `/users/${userId}`,
    };

    dispatch(action({ dataKey, request, switchCity }));
  };
}

export function updateUserSettings(settingsData) {
  const action = createAction(SERVICE_API.UPDATE_USER_SETTINGS);
  const dataKey = 'userSettingsUpdate';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      data: settingsData,
      headers: buildHeaders(state),
      method: 'put',
      transformResponse: ({ result }) => User.build(result),
      url: `/users/${userId}/settings`,
    };
    dispatch(action({ dataKey, request }));
  };
}

export function uploadAvatar(fileUri) {
  const action = createAction(SERVICE_API.UPLOAD_AVATAR);
  const dataKey = 'avatarUpload';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const data = new FormData();

    if (DEBUGS.UPLOAD_AVATAR_FAILED)
      data.append('avatar_image', { uri: fileUri });
    else
      data.append('avatar_image', {
        uri: fileUri,
        name: `${userId}_${Date.now()}.jpg`,
        type: 'image/jpg',
      });

    const request = {
      data,
      headers: buildHeaders(state),
      method: 'put',
      onUploadProgress: ({ loaded, total }) => {
        const progress = total === 0 ? 0 : loaded / total;
        dispatch(action({ dataKey, progress }));
      },
      transformResponse: ({ result }) => User.build(result),
      url: `/users/${userId}`,
    };

    dispatch(action({ dataKey, request }));
  };
}
