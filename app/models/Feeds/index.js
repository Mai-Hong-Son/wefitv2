/**
 * @providesModule WeFit.Models.Feeds
 */

import Singleton from 'singleton';
import _ from 'lodash';

// Constants
import { FEED_TYPES } from 'redux/constants';

// Locals
import ArticlesFeed from './ArticlesFeed';
import SessionFeed from './SessionFeed';
import StaticFeed from './StaticFeed';

const {
  ANNOUNCEMENTS,
  FULL_SIZE_ARTICLES,
  HALF_SIZE_ARTICLES,
  NEWCOMER,
  PENDING_ORDER,
  SESSION_OCCURRING,
  SESSION_REVIEW,
  SESSION_UPCOMING,
} = FEED_TYPES;

const TYPES_MAPPING = {
  [ANNOUNCEMENTS]: ArticlesFeed,
  [FULL_SIZE_ARTICLES]: ArticlesFeed,
  [HALF_SIZE_ARTICLES]: ArticlesFeed,
  [NEWCOMER]: StaticFeed,
  [PENDING_ORDER]: StaticFeed,
  [SESSION_OCCURRING]: SessionFeed,
  [SESSION_REVIEW]: SessionFeed,
  [SESSION_UPCOMING]: SessionFeed,
};

export { ArticlesFeed, SessionFeed, StaticFeed };

class Feeds extends Singleton {
  buildFeedItems(items) {
    const builtItems = _.map(items, item => {
      const { type } = item;
      const { [type]: ItemClass } = TYPES_MAPPING;
      return ItemClass == null ? undefined : ItemClass.build(item);
    });

    return _.compact(builtItems);
  }
}

export default Feeds.get();
