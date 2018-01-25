/**
 * @providesModule WeFit.Redux.Actions.ServiceApi.Feeds
 */

import { createAction } from 'redux-actions';
// import { Logger } from '@onaclover/react-native-utils';

// Models
import Feeds from 'app/models/Feeds';
import Article from 'app/models/Feeds/Article';
// Constants
import { API_CONFIGS, FEED_TYPES } from 'redux/constants';
import { SERVICE_API } from 'redux/types';

// Utils
import { buildHeaders } from 'redux/utils';

const { PAGINATION } = API_CONFIGS;
const { ANNOUNCEMENTS, FULL_SIZE_ARTICLES, HALF_SIZE_ARTICLES, FAVOR_ARTICLE } = FEED_TYPES;

export function getArticleFeeds() {
  const action = createAction(SERVICE_API.GET_ARTICLE_FEEDS);
  const dataKey = 'articleFeeds';

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      transformResponse: ({ result }) => Feeds.buildFeedItems(result),
      // url: 'http://duyetpt.dev.wefit.vn:8888/articles',
      url: '/articles',
    };

    dispatch(action({ dataKey, request }));
  };
}

export function getArticles(type, page = 1, id, termFilter = []) {
  let action;
  let dataKey;
  const appendData = page > 1;

  if (type === ANNOUNCEMENTS) {
    action = createAction(SERVICE_API.GET_ANNOUNCEMENTS);
    dataKey = 'announcements';
  }

  if (type === FULL_SIZE_ARTICLES || type === 'filter') {
    action = createAction(SERVICE_API.GET_FULL_SIZE_ARTICLE);
    dataKey = 'fullSizeArticle';
  }

  if (type === HALF_SIZE_ARTICLES) {
    action = createAction(SERVICE_API.GET_HALF_SIZE_ARTICLE);
    dataKey = 'halfSizeArticle';
  }

  if (type === FAVOR_ARTICLE) {
    action = createAction(SERVICE_API.FAVOR_ARTICLE);
    dataKey = 'fullSizeArticle';
  }

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      params: { page, per_page: PAGINATION },
      transformResponse: ({ result }) => Article.buildArray(result),
      url: id ? `/articles/${type}/${id}?categories=${termFilter}` : `/articles/${type}`,
    };

    dispatch(action({ dataKey, request, appendData }));
  };
}

export function getArticleCategories(type) {
  const action = createAction(SERVICE_API.GET_CATEGORIES_CONTENT);
  const dataKey = 'articleCategories';

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      transformResponse: ({ result }) => result,
      url: `/terms/${type}`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function getArticlesFilter(id) {
  const action = createAction(SERVICE_API.GET_ARTICLES_FILTER);
  const dataKey = 'articleFilter';

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      transformResponse: ({ result }) => result,
      url: `/terms/${id}/filter`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function getArticleDetail(id) {
  const action = createAction(SERVICE_API.ARTICLE_DETAIL);
  const dataKey = 'articleDetail';

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      transformResponse: ({ result }) => result,
      url: `/article/${id}`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function addFavorite(id) {
  const action = createAction(SERVICE_API.ADD_FAVORITE);
  const dataKey = 'favoriteReserve';

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      method: 'post',
      transformResponse: ({ result }) => result,
      url: `/articles/${id}/bookmark`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function deleteFavorite(id) {
  const action = createAction(SERVICE_API.DELETE_FAVORITE);
  const dataKey = 'favoriteReserve';

  return (dispatch, getState) => {
    const request = {
      headers: buildHeaders(getState()),
      method: 'delete',
      transformResponse: ({ result }) => result,
      url: `/articles/${id}/bookmark`,
    };

    dispatch(action({ dataKey, request }));
  };
}

export function getUserFeeds() {
  const action = createAction(SERVICE_API.GET_USER_FEEDS);
  const dataKey = 'userFeeds';

  return (dispatch, getState) => {
    const state = getState();
    const { auth: { userData: { id: userId } } } = state;

    const request = {
      headers: buildHeaders(state),
      transformResponse: ({ result }) => Feeds.buildFeedItems(result),
      url: `/users/${userId}/feed`,
    };

    dispatch(action({ dataKey, request }));
  };
}
