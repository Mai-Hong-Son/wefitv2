/**
 * @providesModule WeFit.Components.Home.Articles.filterArticles.index
 */
import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import Button from 'react-native-button';
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';
import { FontUtils, Extensions } from '@onaclover/react-native-utils';

import _ from 'lodash';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import CollapsibleScrollView, { FooterBox } from 'app/components/Reusables/CollapsibleScrollView';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Locals
import withConnect from './withConnect';

@withConnect
export default class FilterArticles extends React.PureComponent {
  static navigationOptions = () => ({
    title: I18n.t('filters.title'),
  });
  static propTypes = {
    applyArticleFilters: PropTypes.func.isRequired,
    articleFilter: PropTypes.object.isRequired,
    articleFiltered: PropTypes.object.isRequired,
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    const { articleFilter: { data }, articleFiltered: { filters: oldFilters } } = this.props;
    const tempTerms = this.cloneArray(oldFilters);
    this.applyArticleFilters = this.props.applyArticleFilters.bind(this);
    this.state = { dataLocal: [], dataTerms: {}, filters: tempTerms, dataSubject: {} };
    const { dataLocal, dataTerms } = this.state;
    
    _.forEach(data, (item, index) => {
      dataLocal.push(item.name);
      dataTerms[index] = item.terms;
    });
  }

  componentDidMount() {
    const { articleFiltered: { filters } } = this.props;
    const { dataSubject } = this.state;
    _.forEach(filters, subject => {
      dataSubject[subject] = true;
    });
  }

  cloneArray = array => {
    const tempArray = [];
    for (let index = 0; index < array.length; index = index + 1)
      tempArray.push(array[index]);
    return tempArray;
  }

  onClearGoals = () => {
    const { dataSubject, filters } = this.state;
    _.forEach(filters, subject => {
      dataSubject[subject] = false;
    });
    this.setState({ filters: [], dataSubject: { ...dataSubject } });
  }

  onSubmitFilter = async () => {
    const { goBack } = this.props.navigation;
    const { filters } = this.state;
    this.applyArticleFilters({ filters, loading: true });
    await Extensions.nap(50);  
    goBack();  
  }

  onSelect = id => {
    const { dataSubject, filters } = this.state;
    if (filters.indexOf(id) === -1) filters.push(id);
    else {
      const index = filters.indexOf(id);
      filters.splice(index, 1);
    }
    filters.sort();
    dataSubject[id] = !dataSubject[id];
    this.setState({ dataSubject: { ...dataSubject }, filters });
  }

  renderSubject = subject => {
    const { id, name } = subject.item;
    const { dataSubject } = this.state;
    return (
      <View style={styles.containerSubject}>
        <Button onPress={() => this.onSelect(id)}>
          <View style={[styles.checkbox, dataSubject[id] && styles.checkboxSelected]} />
          <Text numberOfLines={1} style={styles.title}>{name}</Text>
        </Button>
      </View>    
    );
  }

  renderTerm = dataTerms => (
    <View style={styles.containerTerm}>
      <FlatList
        data={dataTerms}
        extraData={this.state}
        keyExtractor={({ id }) => id}
        numColumns={2}
        renderItem={this.renderSubject}
      />
    </View>
  );

  render() {
  // if (_.isEmpty(data)) return null;
    const { dataLocal, dataTerms } = this.state;
    return (
      <View style={styles.container}>
        <CollapsibleScrollView
          sectionTitles={dataLocal}
        >
          {this.renderTerm(dataTerms[0])}
          {this.renderTerm(dataTerms[1])}
          {this.renderTerm(dataTerms[2])}
        </CollapsibleScrollView>
        <FooterBox
          clearTitle={I18n.t('filters.buttons.clear')}
          onClear={this.onClearGoals}
          onSubmit={this.onSubmitFilter}
          submitTitle={I18n.t('filters.buttons.apply')}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WEFIT,
  },
  containerSubject: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 20,
    marginBottom: 5,
    marginTop: 5,
    width: 150,
    overflow: 'hidden',
  },
  containerTerm: {
    flex: 1,
    marginBottom: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 1,
    height: 20,
    marginRight: 10,
    width: 20,
  },
  checkboxSelected: {
    backgroundColor: COLORS.PINK,
    borderWidth: 0,
  },
  title: FontUtils.build({
    color: 'white',
    size: 14,
  }),
});
