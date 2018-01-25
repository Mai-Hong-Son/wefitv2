/**
 * @providesModule WeFit.Models.Feeds.Article
 */

import _ from 'lodash';

// Models
import BaseModel, { COMMON_SCHEMAS } from 'app/models/BaseModel';

const { BOOLEAN, DATE, ID, STRING, STRINGS_ARRAY } = COMMON_SCHEMAS;

/* eslint-disable dot-notation, newline-per-chained-call */

export default class Article extends BaseModel {
  static dataValidator() {
    return {
      author: STRING,
      bookmarked: BOOLEAN,
      created_at: DATE,
      id: ID,
      instant_content: STRING,
      permalink: STRING,
      source_url: STRING.required(),
      tags: STRINGS_ARRAY,
      thumbnail: STRING.required(),
      title: STRING.required(),
      type: STRING.required(),
    };
  }

  constructor(data) {
    super(data);

    const { tags } = data;
    this.tags = _.compact(tags);
  }
}

/* eslint-enable dot-notation, newline-per-chained-call */
