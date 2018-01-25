/**
 * @providesModule WeFit.Redux.Actions.ServiceApi.Reviews
 */

import { createAction } from 'redux-actions';

// Constants
import { API_CONFIGS } from 'redux/constants';
import { SERVICE_API } from 'redux/types';

// Models
import Review from 'app/models/Review';

// Utils
import { buildHeaders } from 'redux/utils';

const { PAGINATION } = API_CONFIGS;

export function cancelReview(reviewId) {
  const action = createAction(SERVICE_API.CANCEL_REVIEW);
  const dataKey = 'reviewCancel';

  return (dispatch, getState) => {
    const request = {
      data: { status: 'closed' },
      headers: buildHeaders(getState()),
      method: 'put',
      url: `/reviews/${reviewId}`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function getDetailReviews({ courseId, page, studioId, tabId }) {
  const action = createAction(SERVICE_API.GET_DETAIL_REVIEWS);
  const appendData = page > 1;
  const dataKey = 'detailReviews';
  
  return (dispatch, getState) => {
    if (courseId == null && studioId == null) return;

    const url = studioId != null ? `/studios/${studioId}/reviews` : `/courses/${courseId}/reviews`;

    const request = {
      url,
      headers: buildHeaders(getState()),
      params: {
        page,
        exclude_empty_content: true,
        per_page: PAGINATION,
      },
      transformResponse: ({ result }) => Review.buildArray(result),
    };

    dispatch(action({ appendData, dataKey, request, tabId }));
  };
}

export function getPendingReviews() {
  const action = createAction(SERVICE_API.GET_PENDING_REVIEWS);
  const dataKey = 'pendingReviews';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      headers: buildHeaders(state),
      params: { status: 'unreviewed' },
      transformResponse: ({ result }) => Review.buildArray(result),
      url: `/users/${userId}/reviews`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function submitReview({ content, ratingScore, reviewId }) {
  const action = createAction(SERVICE_API.SUBMIT_REVIEW);
  const dataKey = 'reviewSubmission';

  return (dispatch, getState) => {
    const request = {
      data: { content, rating_score: ratingScore },
      headers: buildHeaders(getState()),
      method: 'put',
      url: `/reviews/${reviewId}`,
    };

    dispatch(action({ dataKey, request }));
  };
}
