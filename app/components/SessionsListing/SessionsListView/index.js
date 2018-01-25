/**
 * @providesModule WeFit.Components.SessionsListing.SessionsListView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import RefreshableList from '@onaclover/react-native-refreshable-list';
import _ from 'lodash';

// Components
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';
import Props from 'app/components/Reusables/Props';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { MY_SESSIONS_TABS } from 'redux/constants';

// Models
import { FitnessType } from 'app/models/BaseStaticData';
import Studio from 'app/models/Studio';
import AccountSettings from 'app/models/AccountSettings';

// Utils
import { hasFilters } from 'app/utils/FilterHelpers';

// Locals
import DataRow from './DataRow';
import EmptyRow from './EmptyRow';
import withConnect from './withConnect';

const { MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES } = MAIN_ROUTES;

@withConnect
export default class SessionsListView extends React.PureComponent {
  static propTypes = {
    filters: Props.filters.isRequired,
    fitnessTypeIndices: PropTypes.objectOf(PropTypes.number).isRequired,
    fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
    lastSchedulesReloaded: PropTypes.number.isRequired,
    onFetchSessions: PropTypes.func.isRequired,
    onSelectSession: PropTypes.func.isRequired,
    onViewSchedules: PropTypes.func,
    sessionsData: Props.sessionsData.isRequired,
    settings: PropTypes.instanceOf(AccountSettings).isRequired,
    studioIndices: PropTypes.objectOf(PropTypes.string).isRequired,
    studiosByCity: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(Studio))).isRequired,
    tabId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf(_.values(MY_SESSIONS_TABS)),
    ]).isRequired,
    variant: PropTypes.oneOf([MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES]).isRequired,
  };

  static defaultProps = {
    onViewSchedules: null,
  };

  constructor(props) {
    super(props);

    this.onFetchSessions = this.props.onFetchSessions.bind(this);
    this.onSelectSession = this.props.onSelectSession.bind(this);
    this.timelineVisible = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    const { lastSchedulesReloaded } = this.props;
    const { lastSchedulesReloaded: nextSchedulesReloaded } = nextProps;

    if (lastSchedulesReloaded !== nextSchedulesReloaded)
      this.sessionsList.reloadData();
  }

  componentDidUpdate(prevProps) {
    const { sessionsData: { data, error, loading } } = this.props;
    const { sessionsData: { loading: prevLoading } } = prevProps;

    if (error)
      this.sessionsList.cancelLoading();

    if (!loading && prevLoading)
      this.toggleTimeline(!_.isEmpty(data));
  }

  toggleTimeline = showing => (
    Animated.timing(this.timelineVisible, {
      duration: 750,
      easing: Easing.quad,
      toValue: showing ? 1 : 0,
    }).start()
  );

  onFetchData = ({ page = 1, reloading = false }) => {
    if (reloading) this.toggleTimeline(false);
    this.onFetchSessions({ page });
  }

  renderEmptyData = () => {
    const { filters, onViewSchedules, tabId, variant } = this.props;

    return (
      <EmptyRow
        hasFilters={hasFilters(filters)}
        onViewSchedules={onViewSchedules}
        tabId={tabId}
        variant={variant}
      />
    );
  };

  renderFootLoading = () => <LoadingPlaceholder style={styles.footLoading} />;
  renderPlaceholder = () => <LoadingPlaceholder />;

  renderRow = session => {
    const {
      fitnessTypeIndices, fitnessTypes: types, studioIndices, studiosByCity, tabId, variant,
    } = this.props;
    const { studio_id: studioId, type_codes: codes } = session;
    const fitnessTypes = FitnessType.filterByCodes(types, fitnessTypeIndices, codes);
    const studio = Studio.findById(studiosByCity, studioIndices, studioId);
    const { settings } = this.props;

    return (
      <DataRow
        fitnessTypes={fitnessTypes}
        onSelect={this.onSelectSession}
        session={session}
        studio={studio}
        tabId={tabId}
        userSettings={settings}
        variant={variant}
      />
    );
  };

  renderTimeline = () => {
    const left = this.timelineVisible.interpolate({
      inputRange: [0, 1],
      outputRange: [-2, 28],
    });
    const opacity = this.timelineVisible;

    return <Animated.View style={[styles.timelineGuide, { left, opacity }]} />;
  };

  render() {
    const { sessionsData: { data, hasMore = true }, variant } = this.props;

    return (
      <View style={styles.container}>
        {this.renderTimeline()}
        <RefreshableList
          dataBlob={data}
          hasMoreData={variant === MY_SESSIONS ? false : hasMore}
          onFetchData={this.onFetchData}
          ref={ref => this.sessionsList = ref}
          renderEmptyData={this.renderEmptyData}
          renderFootLoading={this.renderFootLoading}
          renderPlaceholder={this.renderPlaceholder}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },

  timelineGuide: {
    backgroundColor: COLORS.ALL_C,
    bottom: 0,
    left: 28.5,
    position: 'absolute',
    top: 0,
    width: 2,
  },

  footLoading: {
    paddingTop: 0,
  },
});
