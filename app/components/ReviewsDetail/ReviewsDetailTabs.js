/**
 * @providesModule WeFit.Components.ReviewsDetail.ReviewsDetailTabs
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { REVIEWS_DETAIL_TABS } from 'redux/constants';

// Models
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Locals
import ReviewsList from './ReviewsList';

const { SESSION, STUDIO } = REVIEWS_DETAIL_TABS;

export default class ReviewsDetailTabs extends React.PureComponent {
  static propTypes = {
    session: PropTypes.instanceOf(Session).isRequired,
    studio: PropTypes.instanceOf(Studio).isRequired,
  };

  constructor(props) {
    super(props);

    const { session, studio } = this.props;
    
    const {
      session: sessionTitle, studio: studioTitle,
    } = I18n.t('detailScrollView.reviewsDetail.titles');

    this.state = {
      index: 0,
      routes: [
        // get session's reviews
        { key: SESSION, session, title: sessionTitle },
        // get studio's reviews without session's reviews
        { key: STUDIO, session, studio, title: studioTitle },
      ],
    };
  }

  renderHeader = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      renderLabel={this.renderLabel}
      style={styles.tabBar}
    />
  );

  renderLabel = ({ focused, route }) => {
    const { title } = route;
    return <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{title}</Text>;
  };

  renderScene = SceneMap({ [SESSION]: ReviewsList, [STUDIO]: ReviewsList });

  render() {
    return (
      <TabViewAnimated
        navigationState={this.state}
        onIndexChange={index => this.setState({ index })}
        renderHeader={this.renderHeader}
        renderScene={this.renderScene}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'transparent',
    height: 40,
  },
  tabLabel: FontUtils.build({
    align: 'center',
    color: COLORS.ALL_9,
    size: 17,
  }),
  tabLabelFocused: {
    color: 'white',
  },
  tabIndicator: {
    backgroundColor: COLORS.PINK,
    height: 4,
  },
});
