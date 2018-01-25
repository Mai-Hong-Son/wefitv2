/**
 * @providesModule WeFit.Components.SessionsListing
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { HotlineButton } from 'app/components/Reusables/Buttons';
import Props from 'app/components/Reusables/Props';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { MAIN_ROUTES, ROOT_ROUTES } from 'app/constants/RouteNames';
import { MY_SESSIONS_TABS } from 'redux/constants';

// Models
import RemoteConfigs from 'app/models/RemoteConfigs';
import Studio from 'app/models/Studio';

// Locals
import SessionsListView from './SessionsListView';
import withConnect from './withConnect';

const {
  MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES,
  SESSION_DETAIL, SEARCH_STUDIOS,
} = MAIN_ROUTES;

const { UPCOMING, PAST } = MY_SESSIONS_TABS;

const OVERALL_SCHEDULES_INDEX = 1;
const MY_SESSIONS_INDEX = 3;

@withConnect
export default class SessionsListing extends React.PureComponent {
  static propTypes = {
    dateId: PropTypes.string,
    getMySessions: PropTypes.func.isRequired,
    getOverallSchedules: PropTypes.func.isRequired,
    getStudioSchedules: PropTypes.func.isRequired,
    mainRouter: PropTypes.shape({
      routes: PropTypes.arrayOf(PropTypes.shape({
        index: PropTypes.number,
        routes: PropTypes.arrayOf(PropTypes.object),
      }).isRequired).isRequired,
    }).isRequired,
    mySessions: PropTypes.objectOf(Props.sessionsData).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    overallSchedules: PropTypes.objectOf(Props.sessionsData).isRequired,
    remoteConfigs: PropTypes.instanceOf(RemoteConfigs).isRequired,
    studioSchedules: PropTypes.objectOf(Props.sessionsData).isRequired,
    tabId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    tabParams: PropTypes.shape({
      studio: PropTypes.instanceOf(Studio),
    }),
    variant: PropTypes.oneOf([MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES]).isRequired,
  };

  static defaultProps = {
    dateId: null,
    tabParams: {},
  };

  constructor(props) {
    super(props);

    this.getMySessions = this.props.getMySessions.bind(this);
    this.getOverallSchedules = this.props.getOverallSchedules.bind(this);
    this.getStudioSchedules = this.props.getStudioSchedules.bind(this);
  }

  /**
   * Check if current tabId is active or not
   * There're several steps:
   *  + For overall schedules:
   *    - Check if current mainRouter's index is equal to OVERALL_SCHEDULES_INDEX or not
   *    - Check if current overall schedules tab's index is equal to tabId or not
   *  + For my sessions:
   *    - Check if current mainRouter's index is equal to MY_SESSIONS_INDEX or not
   *    - Check if current my sessions tab's index is equal to [UPCOMING, PAST] index or not
   *  + For studio schedules:
   *    - Just check if current studio schedules index is equal to tabId or not
   * Each checking should be early returned for best performant
   */
  get isCurrentTabActive() {
    const { mainRouter: { routes: mainRoutes }, tabId, variant } = this.props;
    const { index: mainIndex, routes: tabNavRoutes } = _.find(mainRoutes, { routeName: ROOT_ROUTES.MAIN });

    if (variant === OVERALL_SCHEDULES) {
      if (mainIndex !== OVERALL_SCHEDULES_INDEX || tabNavRoutes == null) return false;

      const { routes: tabRoutes } = tabNavRoutes[mainIndex];
      const { index } = tabRoutes[0];
      return tabId === index;
    }
    
    if (variant === MY_SESSIONS) {
      if (mainIndex !== MY_SESSIONS_INDEX || tabNavRoutes == null) return false;
      
      const { routes: tabRoutes } = tabNavRoutes[mainIndex];
      const { index } = tabRoutes[0];
      return tabId === [UPCOMING, PAST][index];
    }

    if (variant === STUDIO_SCHEDULES) {
      const { index } = _.find(mainRoutes, { routeName: STUDIO_SCHEDULES }) || {};
      return tabId === index;
    }

    return false;
  }

  get sessionsData() {
    const { tabId, mySessions, overallSchedules, studioSchedules, variant } = this.props;

    switch (variant) {
      case MY_SESSIONS: return mySessions[tabId];
      case OVERALL_SCHEDULES: return overallSchedules[tabId];
      case STUDIO_SCHEDULES: return studioSchedules[tabId];
      default: return [];
    }
  }

  onSelectSession = (session, studio) => {
    const { navigation: { navigate }, variant } = this.props;
    navigate(SESSION_DETAIL, { session, studio, variant });
  };

  onSearchStudios = () => {
    const { navigation: { navigate } } = this.props;
    navigate(SEARCH_STUDIOS);
  }

  onViewSchedules = () => {
    const { navigation: { navigate } } = this.props;
    navigate(OVERALL_SCHEDULES);
  };

  requestSessions = ({ page = 1 }) => {
    const { dateId, tabId, tabParams: { studio: { id: studioId } = {} }, variant } = this.props;

    switch (variant) {
      case MY_SESSIONS: this.getMySessions({ tabId }); break;
      case OVERALL_SCHEDULES: this.getOverallSchedules({ dateId, page, tabId }); break;
      case STUDIO_SCHEDULES: this.getStudioSchedules({ dateId, page, tabId, studioId }); break;
      default: break;
    }
  };

  render() {
    if (!this.isCurrentTabActive) return null;
    
    const { remoteConfigs: { hotline_default: hotline }, tabId, variant } = this.props;

    return (
      <View style={styles.container}>
        <SessionsListView
          onFetchSessions={this.requestSessions}
          onSelectSession={this.onSelectSession}
          onViewSchedules={this.onViewSchedules}
          sessionsData={this.sessionsData}
          tabId={tabId}
          variant={variant}
        />
        {variant === OVERALL_SCHEDULES && (
          <Button containerStyle={styles.searchButton} onPress={this.onSearchStudios}>
            <Image source={require('app/assets/buttons/search.png')} />
          </Button>
        )}
        {variant === MY_SESSIONS && tabId === UPCOMING && (hotline != null) && (
          <View style={styles.hotlineContainer}>
            <Text style={styles.hotlineInstructions}>
              {I18n.t('mySessions.haveQuestion')}
            </Text>
            <HotlineButton number={hotline} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  searchButton: {
    bottom: 16,
    position: 'absolute',
    right: 16,
  },

  hotlineContainer: {
    ...SHEETS.horizontalFlex,
    backgroundColor: COLORS.ALL_E,
    borderRadius: 4,
    bottom: 16,
    height: 32,
    position: 'absolute',
    right: 16,
  },
  hotlineInstructions: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 14,

    // Extra
    marginHorizontal: 10,
  }),
});

