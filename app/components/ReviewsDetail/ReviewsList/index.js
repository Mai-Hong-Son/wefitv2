/**
 * @providesModule WeFit.Components.ReviewsDetail.ReviewsList
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import RefreshableList from '@onaclover/react-native-refreshable-list';
// import { Logger } from '@onaclover/react-native-utils';
// import _ from 'lodash';

// Components
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';
import Props from 'app/components/Reusables/Props';

// Constants
// import { COLORS, NAVIGATION, SHEETS } from 'app/constants/AppStyles';
import { REVIEWS_DETAIL_TABS } from 'redux/constants';

// Models
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Locals
import DataRow from './DataRow';
import EmptyRow from './EmptyRow';
import withConnect from './withConnect';

const { SESSION, STUDIO } = REVIEWS_DETAIL_TABS;

@withConnect
export default class ReviewsList extends React.PureComponent {
  static propTypes = {
    detailReviews: PropTypes.objectOf(Props.reviewsData).isRequired,
    forStudioDetail: PropTypes.bool,
    getDetailReviews: PropTypes.func.isRequired,
    route: PropTypes.shape({
      key: PropTypes.oneOf([SESSION, STUDIO]).isRequired,
      session: PropTypes.instanceOf(Session),
      studio: PropTypes.instanceOf(Studio),
    }).isRequired,
  };

  static defaultProps = {
    forStudioDetail: false,
  };

  constructor(props) {
    super(props);
    this.getDetailReviews = this.props.getDetailReviews.bind(this);
  }

  get detailReviews() {
    const { route: { key }, detailReviews: { [key]: { data = [], hasMore } } } = this.props;
    return { data, hasMore };
  }

  requestDetailReviews = ({ page }) => {
    const { route: { key: tabId, session, studio } } = this.props;
    if (session == null && studio == null) return;

    const { course_id: courseId } = session || {};
    const { id: studioId } = studio || {};

    this.getDetailReviews({ courseId, page, studioId, tabId });
  };

  renderEmptyData = () => <EmptyRow tabId={this.props.route.key} />;
  renderFootLoading = () => <LoadingPlaceholder style={styles.footLoading} />;
  renderPlaceholder = () => <LoadingPlaceholder />;
  renderRow = review => <DataRow review={review} />;

  render() {
    const { data, hasMore } = this.detailReviews;

    return (
      <RefreshableList
        dataBlob={data}
        hasMoreData={hasMore}
        onFetchData={this.requestDetailReviews}
        renderEmptyData={this.renderEmptyData}
        renderFootLoading={this.renderFootLoading}
        renderPlaceholder={this.renderPlaceholder}
        renderRow={this.renderRow}
        style={styles.container}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    backgroundColor: 'white',
    flex: 1,
  },
  footLoading: {
    paddingTop: 0,
  },
});
