/**
 * @providesModule WeFit.Components.Home
 */

import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, StyleSheet } from 'react-native';
import { DeviceUtils, Logger } from '@onaclover/react-native-utils';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';
import ParallaxScrollView from 'app/components/Reusables/ParallaxScrollView';

// Constants
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { FEED_TYPES } from 'redux/constants';

// Models
import { ArticlesFeed, SessionFeed, StaticFeed } from 'app/models/Feeds';
import PaymentOrder from 'app/models/PaymentOrder';
import User from 'app/models/User';

// Locals
import { SessionCard, StaticCard, WeFitTipsCard } from './Cards';
import HeaderBox from './HeaderBox';
import SwiperList from './SwiperList';
import withConnect from './withConnect';
import Announcement from './Announcement';

const {
  ANNOUNCEMENTS,
  FULL_SIZE_ARTICLES,
  HALF_SIZE_ARTICLES,
  NEWCOMER,
  PENDING_ORDER,
  SESSION_OCCURRING,
  SESSION_REVIEW,
  SESSION_UPCOMING,
  WEFIT_TIPS,
} = FEED_TYPES;

const BACKGROUND_HEIGHT = 180;
const PARALLAX_HEIGHT = 140;

const { INTERNAL_WEB_BROWSER,
  MY_SESSIONS, PAYMENT_GATEWAY,
  ARTICLE_CATEGORIES_CONTENT,
  RECOMMENDED_ARTICLES_LIST,
  ANNOUNCEMENT_ARTICLES_LIST } = MAIN_ROUTES;

const COMPONENTS_MAPPING = {
  [ANNOUNCEMENTS]: Announcement,
  [FULL_SIZE_ARTICLES]: SwiperList,
  [HALF_SIZE_ARTICLES]: SwiperList,
  [NEWCOMER]: StaticCard,
  [PENDING_ORDER]: StaticCard,
  [SESSION_OCCURRING]: SessionCard,
  [SESSION_REVIEW]: SessionCard,
  [SESSION_UPCOMING]: SessionCard,
  [WEFIT_TIPS]: WeFitTipsCard,
};

@withConnect
export default class Home extends React.PureComponent {
  static propTypes = {
    articleFeeds: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.instanceOf(ArticlesFeed)).isRequired,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    cancelPaymentOrder: PropTypes.func.isRequired,
    getArticleFeeds: PropTypes.func.isRequired,
    getUserFeeds: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    lastHomeFeedsReloaded: PropTypes.number.isRequired,
    navigateSession: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    paymentOrderRequest: PropTypes.shape({
      data: PropTypes.instanceOf(PaymentOrder),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    requestPaymentOrder: PropTypes.func.isRequired,
    userData: PropTypes.instanceOf(User).isRequired,
    userFeeds: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.instanceOf(SessionFeed),
        PropTypes.instanceOf(StaticFeed),
      ])).isRequired,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.cancelPaymentOrder = this.props.cancelPaymentOrder.bind(this);
    this.getArticleFeeds = this.props.getArticleFeeds.bind(this);
    this.getUserFeeds = this.props.getUserFeeds.bind(this);
    this.navigateSession = this.props.navigateSession.bind(this);
    this.requestPaymentOrder = this.props.requestPaymentOrder.bind(this);

    this.state = { feedsData: [], reloading: true };
  }

  componentDidMount() {
    this.reloadData();
  }

  componentWillReceiveProps(nextProps) {
    const { lastHomeFeedsReloaded, paymentOrderRequest } = this.props;
    const {
      lastHomeFeedsReloaded: nextHomeFeedsReloaded,
      paymentOrderRequest: nextPaymentOrderRequest,
    } = nextProps;

    this.checkAndBuildFeedsData(nextProps);

    if (lastHomeFeedsReloaded !== nextHomeFeedsReloaded)
      this.reloadData();

    if (paymentOrderRequest !== nextPaymentOrderRequest) {
      const { data, loading } = nextPaymentOrderRequest;
      if (!loading && data != null) this.navigatePaymentGateway(data);
    }
  }

  checkAndBuildFeedsData = nextProps => {
    const { articleFeeds, userFeeds } = this.props;
    const { articleFeeds: nextArticles, userFeeds: nextUserFeeds } = nextProps;

    if (articleFeeds === nextArticles && userFeeds === nextUserFeeds) return;

    const { data: articles, loading: loadingArticles } = nextArticles;
    const { data: userItems, loading: loadingFeeds } = nextUserFeeds;
    
    if (loadingArticles || loadingFeeds) return;

    const feedsData = _.compact([
      _.isEmpty(userItems) && StaticFeed.placeholder,
      ...userItems,
      ...articles,
    ]);
    this.setState({ feedsData, reloading: false });
  };

  navigatePaymentGateway = order => {
    const { navigation: { navigate } } = this.props;
    navigate(PAYMENT_GATEWAY, { order });
  };
  
  refreshData = () => {
    this.getArticleFeeds();
    this.getUserFeeds();
  };

  reloadData = () => this.setState({ reloading: true }, this.refreshData);

  onDismiss = item => {
    switch (item.type) {
      case PENDING_ORDER: {
        const { payload: { id: orderId } } = item;
        this.cancelPaymentOrder(orderId);
        break;
      }
      default: break;
    }

    const { feedsData } = this.state;
    const newData = _.clone(feedsData);
    _.pull(newData, item);

    const userFeedTypes = [
      NEWCOMER, PENDING_ORDER, SESSION_OCCURRING, SESSION_REVIEW, SESSION_UPCOMING,
    ];
    const remainingTypes = _.map(newData, 'type');
    
    if (_.isEmpty(_.intersection(remainingTypes, userFeedTypes)))
      this.setState({ feedsData: [StaticFeed.placeholder, ...newData] });
    else
      this.setState({ feedsData: newData });
  };
  
  onProcess = item => {
    const { type } = item;

    switch (type) {
      case ANNOUNCEMENTS: {
        const { navigation: { navigate } } = this.props;
        const { title, source_url: uri, id } = item;
        navigate(INTERNAL_WEB_BROWSER, { title, uri, id });
        return;
      }
      case FULL_SIZE_ARTICLES:
      case HALF_SIZE_ARTICLES: {
        const { navigation: { navigate } } = this.props;
        const { title, source_url: uri, id, type } = item;
        navigate(INTERNAL_WEB_BROWSER, { title, uri, id, type });
        return;
      }
      case SESSION_UPCOMING: {
        const { session } = item;
        this.navigateSession({ session, variant: MY_SESSIONS });
        return;
      }
      case PENDING_ORDER: {
        const { payload: { membership_id: membershipId, promo_code: promoCode, type } } = item;
        this.requestPaymentOrder({ membershipId, promoCode, type });
        return;
      }
      default: {
        Logger.debug(item);
        return;
      }
    }
  };

  onSeeAll = type => {
    const { recommendations, categoriesContent, announcements } = I18n.t('home.swiper');
    const { navigation: { navigate } } = this.props;

    if (type === ANNOUNCEMENTS) {
      const title = announcements;
      navigate(ANNOUNCEMENT_ARTICLES_LIST, { title, type });
    }

    if (type === HALF_SIZE_ARTICLES) {
      const title = recommendations;
      navigate(RECOMMENDED_ARTICLES_LIST, { title, type });
    }

    if (type === FULL_SIZE_ARTICLES) {
      const title = categoriesContent;
      navigate(ARTICLE_CATEGORIES_CONTENT, { title, type });
    }
  };

  renderBackground = scrollOffset => {
    const { language, userData } = this.props;
    
    return (
      <HeaderBox
        height={BACKGROUND_HEIGHT}
        language={language}
        scrollOffset={scrollOffset}
        userData={userData}
      />
    );
  };

  renderFeedItem = (item, index) => {
    const { type } = item;
    const { [type]: ItemComponent } = COMPONENTS_MAPPING;

    if (ItemComponent == null) return null;
    
    return (
      <ItemComponent
        data={item}
        key={`feed_item_${index}`}
        language={this.props.language}
        onDismiss={this.onDismiss}
        onProcess={this.onProcess}
        onSeeAll={this.onSeeAll}
      />
    );
  };

  renderRefreshControl = () => {
    const { reloading } = this.state;
    if (reloading) return null;
    
    const {
      articleFeeds: { loading: loadingArticles },
      userFeeds: { loading: loadingFeeds },
    } = this.props;

    return (
      <RefreshControl
        onRefresh={this.refreshData}
        refreshing={loadingFeeds || loadingArticles}
        tintColor="white"
      />
    );
  };

  render() {
    const { feedsData, reloading } = this.state;

    return (
      <ParallaxScrollView
        backgroundHeight={BACKGROUND_HEIGHT}
        contentStyle={styles.container}
        keyboardShouldPersistTaps="always"
        maskColor="transparent"
        parallaxHeight={PARALLAX_HEIGHT}
        refreshControl={this.renderRefreshControl()}
        renderBackground={this.renderBackground}
        showsVerticalScrollIndicator={false}
      >
        <LoadingPlaceholder style={styles.loadingPlacholder} visible={reloading} />
        {_.map(feedsData, this.renderFeedItem)}
      </ParallaxScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: DeviceUtils.screen.width,
  },
  loadingPlacholder: {
    marginTop: 36,
  },
});
