/**
 * @providesModule WeFit.Constants.AppStyles
 */

import { Platform } from 'react-native';
import { TabBarTop } from 'react-navigation';
import { DeviceUtils, FontUtils } from '@onaclover/react-native-utils';

const { width: SCREEN_WIDTH } = DeviceUtils.screen;

const HEADER_POSITION = {
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
};

const TRANSPARENT_HEADER = Platform.select({
  android: {
    elevation: 0,
    paddingTop: 20,
  },
  ios: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
  },
});

export const COLORS = {  
  FACEBOOK:               '#3b5998',
  GOOGLE:                 '#dd4b39',
  STARS:                  '#ff9800',
  WEFIT:                  '#292941',
  
  ALL_6:                  '#666666',
  ALL_9:                  '#999999',
  ALL_C:                  '#cccccc',
  ALL_E:                  '#eeeeee',
  TRIPLE_6E:              '#6e6e6e',
  PINK:                   '#e82e81',
  PURPLE:                 '#83358b',

  BLACK_OPAQUE_MIN:       'rgba(0, 0, 0, 0.1)',
  BLACK_OPAQUE_HALF:      'rgba(0, 0, 0, 0.5)',
  PINK_OPAQUE:            'rgba(232, 46, 129, 0.1)',
  WHITE_OPAQUE_MIN:       'rgba(255, 255, 255, 0.1)',
  WHITE_OPAQUE_HALF:      'rgba(255, 255, 255, 0.5)',

  BACKGROUND_GRADIENT: {
    colors: ['#292941', '#2c2944', '#362B4C', '#472D5A', '#5F306D', '#83358b'],
    end: { x: 1, y: 1 },
    locations: [0.2, 0.35, 0.5, 0.65, 0.8, 1],
    start: { x: 0, y: 0 },
  },
};

export const HEADER_HEIGHT = Platform.select({ android: 74, ios: 64 });

export const NAVIGATION = {
  defaultHeader: {
    backgroundColor: COLORS.WEFIT,
    height: HEADER_HEIGHT,
    ...TRANSPARENT_HEADER,
  },
  emptyHeader: {
    backgroundColor: 'transparent',
    height: 0,
    ...HEADER_POSITION,
  },
  filtersHeader: {
    height: HEADER_HEIGHT + 20,
    ...Platform.select({
      android: { paddingTop: 20 },
    }),
  },
  goalsHeader: {
    height: HEADER_HEIGHT + 90,
    ...Platform.select({
      android: { paddingTop: 20 },
    }),
  },
  headerTitle: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 17,
    weight: 'semibold',
  }),
  transparentHeader: {
    backgroundColor: 'transparent',
    height: HEADER_HEIGHT,
    ...HEADER_POSITION,
    ...TRANSPARENT_HEADER,
    ...Platform.select({ ios: { paddingBottom: 20 } }),
  },
};

export const NAVIGATION_OPTIONS = {
  headerBackTitle: null,
  headerPressColorAndroid: 'transparent',
  headerStyle: NAVIGATION.defaultHeader,
  headerTintColor: COLORS.PINK,
  headerTitleStyle: NAVIGATION.headerTitle,
};

export const PARALLAX_HEIGHT = SCREEN_WIDTH * 2 / 3;
export const STANDARD_SCREEN = { height: 667, width: 375 };
export const SCALE_FACTOR = SCREEN_WIDTH / STANDARD_SCREEN.width;

export const SHEETS = {
  absoluteFlex: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  horizontalFlex: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  stretched: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  shadow: Platform.select({
    android: DeviceUtils.androidLowLevelApi ? {
      borderColor: '#999',
      borderWidth: 1,
    } : {
      elevation: 3,
    },
    ios: {
      shadowColor: 'black',
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
  }),
};

export const TABBAR_TOP_STYLES = {
  container: {
    backgroundColor: COLORS.WEFIT,
    height: 36,
  },
  containerFlex: {
    flex: 1,
  },
  indicatorStyle: {
    backgroundColor: COLORS.PINK,
    height: 4,
  },
  labelStyle: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 16,
  }),
  tabStyle: {
    height: 36,
    paddingHorizontal: 0,
    justifyContent: 'flex-end',
    marginTop: 4,
  },
};

export const TABBAR_TOP_CONFIGS = {
  animationEnabled: false,
  backBehavior: 'none',
  swipeEnabled: true,
  tabBarComponent: TabBarTop,
  tabBarOptions: {
    indicatorStyle: TABBAR_TOP_STYLES.indicatorStyle,
    labelStyle: TABBAR_TOP_STYLES.labelStyle,
    pressColor: 'transparent',
    scrollEnabled: true,
    style: TABBAR_TOP_STYLES.container,
    tabStyle: TABBAR_TOP_STYLES.tabStyle,
    upperCaseLabel: false,
  },
  tabBarPosition: 'top',
};
