/**
 * @providesModule WeFit.Components.SearchStudios
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard } from 'react-native';
import RefreshableList from '@onaclover/react-native-refreshable-list';
import _ from 'lodash';

// Components
import SearchHeader from 'app/components/Reusables/SearchHeader';

// Constants
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
import Studio from 'app/models/Studio';
import User from 'app/models/User';

// Locals
import DataRow from './DataRow';
import EmptyRow from './EmptyRow';
import withConnect from './withConnect';

@withConnect
export default class SearchStudios extends React.PureComponent {
  static navigationOptions = ({ navigation: { setParams } }) => ({
    headerTitle: <SearchHeader onChangeValue={payload => setParams(payload)} />,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          rawSearchValue: PropTypes.string,
          searchValue: PropTypes.string,
        }),
      }).isRequired,
    }).isRequired,
    studiosByCity: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(Studio))).isRequired,
    userData: PropTypes.instanceOf(User).isRequired,
  };

  state = { searchResults: [] };

  componentDidMount() {
    this.buildSearchResults();
  }

  componentDidUpdate(prevProps) {
    const { searchValue } = this.passedProps;
    const { searchValue: prevSearchValue } = prevProps.navigation.state.params || {};

    if (searchValue !== prevSearchValue)
      this.buildSearchResults();
  }

  get passedProps() {
    const { rawSearchValue, searchValue } = this.props.navigation.state.params || {};
    return { rawSearchValue, searchValue };
  }

  buildSearchResults = () => {
    const { studiosByCity, userData: { city_code: cityCode } } = this.props;
    const { searchValue = '' } = this.passedProps;

    const { [cityCode]: studios } = studiosByCity;
    const enabledStudios = _.filter(studios, studio => {
      const { is_enabled: isEnabled, sanitized_name: sanitizedName } = studio;
      return isEnabled === true && sanitizedName != null;
    });
    const currentCityStudios = _.sortBy(enabledStudios, ['name']);
    const matchStudios = _.filter(currentCityStudios, ({ sanitized_name: sanitizedName }) => (
      sanitizedName.match(searchValue)
    ));
    const searchResults = _.map(matchStudios, studio => ({ studio, searchValue }));
    this.setState({ searchResults });
  };

  onSelect = studio => {
    Keyboard.dismiss();

    const { navigation: { navigate } } = this.props;
    navigate(MAIN_ROUTES.STUDIO_DETAIL, { studio });
  };

  renderEmptyData = () => {
    const { rawSearchValue = '' } = this.passedProps;
    return <EmptyRow rawSearchValue={rawSearchValue} />;
  };

  renderRow = ({ studio, searchValue }) => (
    <DataRow onSelect={this.onSelect} searchValue={searchValue} studio={studio} />
  );

  render() {
    return (
      <RefreshableList
        dataBlob={this.state.searchResults}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        refreshEnabled={false}
        renderEmptyData={this.renderEmptyData}
        renderRow={this.renderRow}
      />
    );
  }
}
