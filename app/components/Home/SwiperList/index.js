/**
 * @providesModule WeFit.Components.Home.SwiperList
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Constants
import { FEED_TYPES } from 'redux/constants';

// Models
import ArticlesFeed from 'app/models/Feeds/ArticlesFeed';

// Locals
import FullSizeArticle from './FullSizeArticle';
import HalfSizeArticle from './HalfSizeArticle';
import MoreArticle from './MoreArticle';
import TitleBox from './TitleBox';

const { FULL_SIZE_ARTICLES, HALF_SIZE_ARTICLES } = FEED_TYPES;

function getArticleComponent(type) {
  switch (type) {
    case FULL_SIZE_ARTICLES: return FullSizeArticle;
    case HALF_SIZE_ARTICLES: return HalfSizeArticle;
    default: return null;
  }
}

function getTitle(type) {
  const { recommendations, trainingTips } = I18n.t('home.swiper');

  switch (type) {
    case FULL_SIZE_ARTICLES: return trainingTips;
    case HALF_SIZE_ARTICLES: return recommendations;
    default: return null;
  }
}

function footerHeight(type) {
  switch (type) {
    case FULL_SIZE_ARTICLES: return 200;
    case HALF_SIZE_ARTICLES: return 140;
    default: return null;
  }
}

export default function SwiperList({ data, onProcess, onSeeAll }) {
  const { articles, type } = data;
  const ArticleComponent = getArticleComponent(type);
  const heightOfFooter = footerHeight(type);

  if (ArticleComponent == null || _.isEmpty(articles)) return null;

  return (
    <View style={styles.container}>
      <TitleBox hasMore={onSeeAll != null} onSeeAll={() => onSeeAll && onSeeAll(type)} title={getTitle(type)} />
      <FlatList
        ListFooterComponent={
          () => <MoreArticle onSeeAll={() => onSeeAll && onSeeAll(type)} size={heightOfFooter} />
        }
        ListHeaderComponent={() => <View style={styles.header} />}
        data={articles}
        horizontal
        keyExtractor={({ id }) => `item_${type}_article_${id}`}
        renderItem={({ item }) => <ArticleComponent data={item} onSelect={() => onProcess && onProcess(item)} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

SwiperList.propTypes = {
  data: PropTypes.instanceOf(ArticlesFeed).isRequired,
  onPress: PropTypes.func,
  onProcess: PropTypes.func,
  onSeeAll: PropTypes.func,
};

SwiperList.defaultProps = {
  onProcess: null,
  onPress: null,
  onSeeAll: null,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    width: 16,
  },
});
