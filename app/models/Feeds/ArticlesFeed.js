/**
 * @providesModule WeFit.Models.Feeds.ArticlesFeed
 */

// Constants
import { FEED_TYPES } from 'redux/constants';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

// Locals
import Article from './Article';

const { OBJECTS_ARRAY, STRING } = COMMON_SCHEMAS;
const { ANNOUNCEMENTS, FULL_SIZE_ARTICLES, HALF_SIZE_ARTICLES } = FEED_TYPES;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class ArticlesFeed extends BaseModel {
  static dataValidator() {
    return {
      articles: OBJECTS_ARRAY.required(),
      type: STRING.allow([ANNOUNCEMENTS, FULL_SIZE_ARTICLES, HALF_SIZE_ARTICLES]).required(),
    };
  }

  constructor(data) {
    super(data);

    const { articles } = data;
    this.articles = Article.buildArray(articles);
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
