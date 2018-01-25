/**
 * @providesModule WeFit.Constants.RouteNames
 */

export const APP_ROUTES = {
  ROOT:                   'rootStack',
  SPLASH:                 'splashScreen',
};

export const ROOT_ROUTES = {
  AUTH:                   'authStack',
  INTRO:                  'introStack',
  MAIN:                   'mainStack',
  UPDATE_INFO:            'updatePersonalInfo',
};

export const AUTH_ROUTES = {
  EMAIL_LOGIN:            'emailLogin',
  EMAIL_SIGNUP:           'emailSignUp',
  FORGOT_PASSWORD:        'forgotPassword',
  RESET_PASSWORD:         'resetPassword',
  WELCOME:                'welcomeScreen',
};

export const INTRO_ROUTES = {
  ACTIVATION:             'activateMembership',
  INTRO:                  'introScreen',
};

export const MAIN_ROUTES = {
  // Top level screens
  HOME:                   'home',
  OVERALL_SCHEDULES:      'overallSchedules',
  STUDIOS_MAP:            'studiosMap',
  MY_SESSIONS:            'mySessions',
  PROFILE:                'profile',

  // Presented screens
  CHANGE_PASSWORD:        'changePassword',
  
  FAVORITE_STUDIOS:       'favoriteStudios',
  FILTER_ARTICLES:         'filterArticles',
  FILTERS:                'filters',
  
  GOALS:                  'goals',
  INTERNAL_WEB_BROWSER:   'internalWebBrowser',
  ANNOUNCEMENT_ARTICLES_LIST:       'announcementArticlesList',
  ARTICLE_CATEGORIES_CONTENT:       'articleCategoriesContent',
  ARTICLE_TRAININGS_LIST:           'trainingArticles',
  RECOMMENDED_ARTICLES_LIST:        'recommendedArticlesList',

  MEMBERSHIP_PACKS:       'membershipPacks',
  
  PAYMENT_GATEWAY:        'paymentGateway',
  PERSONAL_INFO:          'personalInfo',
  PURCHASE_ONLINE:        'purchaseOnline',
  PURCHASE_RECEIPT:       'purchaseReceipt',
  
  REDEEM_MEMBERSHIP:      'redeemMembership',
  REFERRAL:               'referral',
  REVIEWS_DETAIL:         'reviewsDetail',
  
  SEARCH_STUDIOS:         'searchStudios',
  SESSION_BOOKING:        'sessionBooking',
  SESSION_DETAIL:         'sessionDetail',
  SETTINGS:               'settings',
  STUDIO_DETAIL:          'studioDetail',
  STUDIO_SCHEDULES:       'studioSchedules',
};
