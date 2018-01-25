/**
 * @providesModule WeFit.Components.Home.Articles.paginationArticles
 */
import _ from 'lodash';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
const { INTERNAL_WEB_BROWSER } = MAIN_ROUTES;

export function onEndReached(loading, hasMore, page, props) {
  const { articleFilter, articleFiltered, navigation:{ state: { params: { type, id } } } } = props;
  if (articleFiltered) {
    const { filters } = articleFiltered;
    const { data } = articleFilter;
    if (!loading && hasMore) {
      props.getArticles(type, page + 1, id, getTerms(data, filters));
    }
  } else if (!loading && hasMore) {
    props.getArticles(type, page + 1, id);
  }
}

export function onRefresh(props) {
  const { articleFilter, articleFiltered , navigation:{ state: { params: { type, id } } } } = props;
  if (articleFiltered) {
    const { filters } = articleFiltered;
    const { data } = articleFilter;
    props.getArticles(type, 1, id, getTerms(data, filters));
  } else props.getArticles(type, 1, id);
}

export function showDetail(item, props) {
  const { title, source_url : uri, type , id } = item;
  const { navigation: { navigate } } = props;
  navigate(INTERNAL_WEB_BROWSER, { title, uri, type, id });
}

function getTerms(data, filters) {
  const tempArray = [];
  _.forEach(data, item => {
    _.forEach(item.terms, subject => {
      const index = filters.indexOf(subject.id);
      if (index !== -1) {
        tempArray.push(subject.id);
      }
    });
  });
  return tempArray;
}
