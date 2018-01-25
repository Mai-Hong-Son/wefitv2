/**
 * @providesModule WeFit.Redux.Actions.ServiceApi.Payments
 */

import { createAction } from 'redux-actions';

// Models
import Membership from 'app/models/Membership';
import MembershipPack from 'app/models/MembershipPack';
import PaymentOrder from 'app/models/PaymentOrder';
import PromoData from 'app/models/PromoData';

// Constants
import { SERVICE_API } from 'redux/types';

// Utils
import { buildHeaders } from 'redux/utils';

export function cancelPaymentOrder(orderId) {
  const action = createAction(SERVICE_API.CANCEL_PAYMENT_ORDER);
  const dataKey = 'paymentOrderCancel';

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      method: 'put',
      url: `/orders/${orderId}/cancel`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function checkPromoCode(code) {
  const action = createAction(SERVICE_API.CHECK_PROMOCODE_CODE);
  const dataKey = 'promoCodeChecking';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { city_code: cityCode } } } = state;

    const request = {
      headers: buildHeaders(state),
      params: { city_code: cityCode, promo_code: code },
      transformResponse: ({ result }) => PromoData.build(result),
      url: '/promo_code/check',
    };

    dispatch(action({ dataKey, request }));
  };
}

export function getMembershipPacks() {
  const action = createAction(SERVICE_API.GET_MEMBERSHIP_PACKS);
  const dataKey = 'membershipPacks';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { city_code: cityCode } } } = state;

    const request = {
      headers: buildHeaders(state),
      params: { city_code: cityCode },
      transformResponse: ({ result }) => MembershipPack.buildArray(result),
      url: '/memberships',
    };

    dispatch(action({ dataKey, request }));
  };
}

export function redeemMembership(activationCode) {
  const action = createAction(SERVICE_API.REDEEM_MEMBERSHIP);
  const dataKey = 'membershipActivation';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      data: { activation_code: activationCode },
      headers: buildHeaders(getState()),
      method: 'post',
      transformResponse: ({ result }) => Membership.build(result),
      url: `/users/${userId}/activate`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function requestPaymentOrder({ membershipId, promoCode, type }) {
  const action = createAction(SERVICE_API.REQUEST_PAYMENT_ORDER);
  const dataKey = 'paymentOrderRequest';

  return (dispatch, getState) => {
    const request = {
      data: { type, membership_id: membershipId, promo_code: promoCode },
      headers: buildHeaders(getState()),
      method: 'post',
      transformResponse: ({ result }) => PaymentOrder.build(result),
      url: '/orders',
    };

    dispatch(action({ dataKey, request }));
  };
}
