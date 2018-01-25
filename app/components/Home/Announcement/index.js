/**
 * @providesModule WeFit.Components.Home.Announcement
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';
import I18n from 'react-native-i18n';
import _ from 'lodash';


// Models
import ArticlesFeed from 'app/models/Feeds/ArticlesFeed';
import Button from 'react-native-button';
// import PagedGallery from 'app/components/Reusables/PagedGallery';
import SlidingImages from 'app/components/Reusables/SlidingImages';

// Styles
import { DeviceUtils } from '@onaclover/react-native-utils';

// Locals
import TitleBox from './../SwiperList/TitleBox';

const { width: SCREEN_WIDTH } = DeviceUtils.screen;

export default class Announcement extends React.PureComponent {
  static propTypes = {
    data: PropTypes.instanceOf(ArticlesFeed).isRequired,
    onProcess: PropTypes.func.isRequired,
    onSeeAll: PropTypes.func.isRequired,
  };

  itemOfAnnouncements = item => {
    const { onProcess } = this.props;
    const { id, thumbnail } = item;
    return (
      <View key={id} style={styles.itemOfSwiper}>
        <Button onPress={() => onProcess && onProcess(item)}>
          <View style={styles.wrapOfAnnouncement}>
            <Image resizeMode="cover" source={{ uri: thumbnail }} style={styles.background} />
          </View>
        </Button>
      </View>
    );
  }

  render() {
    const { onSeeAll, data } = this.props;
    const { articles } = data;
    
    if (_.isEmpty(articles)) return null;
    const { announcements } = I18n.t('home.swiper');
    const { type } = data;
    const articlesData = _.map(articles, item => this.itemOfAnnouncements(item));
    
    return (
      <View style={styles.container}>
        <TitleBox hasMore={onSeeAll != null} onSeeAll={() => onSeeAll && onSeeAll(type)} title={announcements} />
        {/* <PagedGallery>
          {articlesData}
        </Swiper> */}
        {/* <PagedGallery>
          {articlesData}
        </PagedGallery> */}
        <SlidingImages
          autoChange
          delay={5000}
          loop
        >
          {articlesData}
        </SlidingImages>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  wrapOfAnnouncement: {
    height: SCREEN_WIDTH / 2.4,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 16,
    bottom: 0,
    right: 16,
    borderRadius: 4,
  },
  itemOfSwiper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
