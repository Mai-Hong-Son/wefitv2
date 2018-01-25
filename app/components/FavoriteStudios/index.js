/**
 * @providesModule WeFit.Components.FavoriteStudios
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import I18n from 'react-native-i18n';
import RefreshableList from '@onaclover/react-native-refreshable-list';
// import { Logger } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
import Studio from 'app/models/Studio';
import User from 'app/models/User';

// Locals
import DataRow from './DataRow';
import EmptyRow from './EmptyRow';
import withConnect from './withConnect';

@withConnect
export default class FavoriteStudios extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('favoriteStudios.title'),
  });

  static propTypes = {
    favoriteStudios: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.number),
    }).isRequired,
    getFavoriteStudios: PropTypes.func.isRequired,
    lastFavoriteStudiosReloaded: PropTypes.number.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    studioIndices: PropTypes.objectOf(PropTypes.string).isRequired,
    studiosByCity: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(Studio))).isRequired,
    userData: PropTypes.instanceOf(User).isRequired,
  };

  constructor(props) {
    super(props);
    this.getFavoriteStudios = this.props.getFavoriteStudios.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { lastFavoriteStudiosReloaded } = this.props;
    const { lastFavoriteStudiosReloaded: nextReloaded } = nextProps;

    if (lastFavoriteStudiosReloaded !== nextReloaded)
      this.favouriteStudiosList.reloadData();
  }

  get studiosData() {
    const { favoriteStudios: { data: studioIds }, studioIndices, studiosByCity } = this.props;
    const paths = _.compact(_.map(studioIds, id => studioIndices[id]));
    return _.map(paths, path => _.get(studiosByCity, path));
  }

  buildStudiosData = () => {
    const { studiosByCity, userData: { city_code: currentCity } } = this.props;
    const { [currentCity]: studios } = studiosByCity;
    return _.slice(_.shuffle(studios), 0, 10);
  };

  onSelectStudio = studio => {
    const { navigation: { navigate } } = this.props;
    navigate(MAIN_ROUTES.STUDIO_DETAIL, { studio });
  };

  renderEmptyData = () => <EmptyRow />;
  renderPlaceholder = () => <LoadingPlaceholder color="#ffffff" />;
  renderRow = studio => <DataRow onSelect={this.onSelectStudio} studio={studio} />;

  render() {
    return (
      <RefreshableList
        containerStyle={styles.contentContainer}
        dataBlob={this.studiosData}
        loadMoreEnabled={false}
        onFetchData={this.getFavoriteStudios}
        ref={ref => this.favouriteStudiosList = ref}
        refreshControlProps={{ tintColor: 'white' }}
        renderEmptyData={this.renderEmptyData}
        renderPlaceholder={this.renderPlaceholder}
        renderRow={this.renderRow}
      />
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: COLORS.WEFIT,
    flex: 1,
  },
});
