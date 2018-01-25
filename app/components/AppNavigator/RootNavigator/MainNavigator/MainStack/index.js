/**
 * @providesModule WeFit.Components.AppNavigator.RootNavigator.MainStack.MainStack
 */

// import { } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import { DeviceUtils } from '@onaclover/react-native-utils';

// Components
import ChangePassword from 'app/components/EmailAuth/ChangePassword';
import FavoriteStudios from 'app/components/FavoriteStudios';
import Filters from 'app/components/Filters';
import FriendsReferral from 'app/components/FriendsReferral';
import Home from 'app/components/Home';
import InternalWebBrowser from 'app/components/InternalWebBrowser';
import MembershipPacksListing from 'app/components/MembershipPacksListing';
import PaymentGateway from 'app/components/PaymentGateway';
import PersonalInfo from 'app/components/PersonalInfo';
import Profile from 'app/components/Profile';
import PurchaseReceipt from 'app/components/PurchaseReceipt';
import RedeemMembership from 'app/components/RedeemMembership';
import ReviewsDetail from 'app/components/ReviewsDetail';
import SearchStudios from 'app/components/SearchStudios';
import SessionBooking from 'app/components/SessionBooking';
import SessionDetail from 'app/components/SessionDetail';
import SetGoals from 'app/components/SetGoals';
import Settings from 'app/components/Settings';
import StudioDetail from 'app/components/StudioDetail';
import ArticleCategoriesContent from 'app/components/Home/ArticleCategoriesContent';
import RecommededArticlesList from 'app/components/Home/Articles/RecommendedArticlesList';
import TrainingArticles from 'app/components/Home/Articles/TrainingArticles';
import AnnouncementArticlesList from 'app/components/Home/Articles/AnnouncementArticlesList';
import FilterArticles from 'app/components/Home/Articles/FilterArticles';

// Constants
import { COLORS, NAVIGATION_OPTIONS } from 'app/constants/AppStyles';
import { ROOT_ROUTES, MAIN_ROUTES } from 'app/constants/RouteNames';

// Locals
import { mainTabOptions } from './TabIcon';
import { withFiltersHeader } from './FiltersHeader';
import { withGoalsHeader } from './GoalsHeader';
import { OverallSchedulesTabs, StudioSchedulesTabs, StudiosMapTabs } from './WeekdayTabs';
import MySessionsTabs from './MySessionsTabs';

const { MAIN } = ROOT_ROUTES;

const {
  HOME, OVERALL_SCHEDULES, STUDIOS_MAP, MY_SESSIONS, PROFILE,
  CHANGE_PASSWORD, FAVORITE_STUDIOS, FILTERS, GOALS, INTERNAL_WEB_BROWSER, FILTER_ARTICLES,
  RECOMMENDED_ARTICLES_LIST, ARTICLE_CATEGORIES_CONTENT, ARTICLE_TRAININGS_LIST, ANNOUNCEMENT_ARTICLES_LIST, 
  MEMBERSHIP_PACKS, PAYMENT_GATEWAY, PERSONAL_INFO, PURCHASE_ONLINE, PURCHASE_RECEIPT,
  REDEEM_MEMBERSHIP, REFERRAL, REVIEWS_DETAIL,
  SEARCH_STUDIOS, SESSION_BOOKING, SESSION_DETAIL, SETTINGS, STUDIO_DETAIL, STUDIO_SCHEDULES,
} = MAIN_ROUTES;

const NO_HEADER = { navigationOptions: { header: null } };

const OverallSchedulesStack = StackNavigator({
  [OVERALL_SCHEDULES]: { screen: OverallSchedulesTabs, ...withFiltersHeader },
});

const StudiosMapStack = StackNavigator({
  [STUDIOS_MAP]: { screen: StudiosMapTabs, ...withFiltersHeader },
});

const MySessionsStack = StackNavigator({
  [MY_SESSIONS]: { screen: MySessionsTabs, ...withGoalsHeader },
});

const MainTabs = TabNavigator({
  [HOME]: { screen: Home, ...mainTabOptions(HOME) },
  [OVERALL_SCHEDULES]: { screen: OverallSchedulesStack, ...mainTabOptions(OVERALL_SCHEDULES) },
  [STUDIOS_MAP]: { screen: StudiosMapStack, ...mainTabOptions(STUDIOS_MAP) },
  [MY_SESSIONS]: { screen: MySessionsStack, ...mainTabOptions(MY_SESSIONS) },
  [PROFILE]: { screen: Profile, ...mainTabOptions(PROFILE) },
}, {
  animationEnabled: false,
  initialRouteName: HOME,
  swipeEnabled: false,
  tabBarComponent: TabBarBottom,
  tabBarOptions: {
    showLabel: false,
    style: { backgroundColor: COLORS.WEFIT },
  },
  tabBarPosition: 'bottom',
});

const PurchaseOnlineStack = StackNavigator({
  [MEMBERSHIP_PACKS]: { screen: MembershipPacksListing },
  [PURCHASE_RECEIPT]: { screen: PurchaseReceipt },
  [PAYMENT_GATEWAY]: { screen: PaymentGateway },
}, {
  navigationOptions: NAVIGATION_OPTIONS,
});

const MainStack = StackNavigator({
  [MAIN]: { screen: MainTabs, ...NO_HEADER },
  [CHANGE_PASSWORD]: { screen: ChangePassword },
  [FAVORITE_STUDIOS]: { screen: FavoriteStudios },
  [FILTERS]: { screen: Filters },
  [GOALS]: { screen: SetGoals },
  [INTERNAL_WEB_BROWSER]: { screen: InternalWebBrowser },
  [RECOMMENDED_ARTICLES_LIST]: { screen: RecommededArticlesList },
  [ARTICLE_CATEGORIES_CONTENT]: { screen: ArticleCategoriesContent },
  [ARTICLE_TRAININGS_LIST]: { screen: TrainingArticles },
  [ANNOUNCEMENT_ARTICLES_LIST]: { screen: AnnouncementArticlesList },
  [FILTER_ARTICLES]: { screen: FilterArticles },
  [PERSONAL_INFO]: { screen: PersonalInfo },
  [PURCHASE_ONLINE]: { screen: PurchaseOnlineStack, ...NO_HEADER },
  [REDEEM_MEMBERSHIP]: { screen: RedeemMembership },
  [REFERRAL]: { screen: FriendsReferral },
  [REVIEWS_DETAIL]: { screen: ReviewsDetail },
  [SEARCH_STUDIOS]: { screen: SearchStudios },
  [SESSION_BOOKING]: { screen: SessionBooking },
  [SESSION_DETAIL]: { screen: SessionDetail },
  [SETTINGS]: { screen: Settings },
  [STUDIO_DETAIL]: { screen: StudioDetail, path: 'studio_detail' },
  [STUDIO_SCHEDULES]: { screen: StudioSchedulesTabs },
}, {
  headerMode: 'screen',
  navigationOptions: {
    ...NAVIGATION_OPTIONS,
    gesturesEnabled: DeviceUtils.platformIsIOS,
  },
});

export default MainStack;
