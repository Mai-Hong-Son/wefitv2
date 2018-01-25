/**
 * @providesModule WeFit.Components.Home.Articles.TrainingArticles.index
 */
import React from 'react';
import { View, StyleSheet, FlatList, Text, Image } from 'react-native';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import { FontUtils } from '@onaclover/react-native-utils';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Icon
// import Ionicons from 'react-native-vector-icons/Ionicons';
// Components
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';
// Constants
// import { COLORS } from 'app/constants/AppStyles';

// Locals
import { onEndReached, onRefresh, showDetail } from '../paginationArticles';
import ContentRow from './ContentRow';
import HeaderFilter from './HeaderFilter';
import withConnect from './withConnect';

// const HeaderRight = () => (
//   <View style={styles.headerRight} >
//     <Ionicons color={COLORS.PINK} name="ios-search" size={25} />
//   </View>
// );

@withConnect
export default class TrainingArticles extends React.PureComponent {
  static navigationOptions = ({ navigation: { state: { params: { title } } } }) => ({
    title,
    // headerRight: <HeaderRight />,
  });

  static propTypes = {
    applyArticleFilters: PropTypes.func.isRequired,
    articleFilter: PropTypes.object.isRequired,
    articleFiltered: PropTypes.object.isRequired,
    fullSizeArticle: PropTypes.object.isRequired,
    getArticles: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          title: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
          id: PropTypes.number,
        }),
      }).isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.getArticles = this.props.getArticles.bind(this);
    this.applyArticleFilters = this.props.applyArticleFilters.bind(this);
    this.state = { page: 1, loadingHeader: true, loadingFooter: false, isHeader: false, titleHeader: [] };
  }
  
  componentDidMount() {
    const { navigation: { state: { params: { type } } } } = this.props;
    if (type === 'bookmarks') this.getArticles(type, 1);
  }
  componentWillReceiveProps(nextProps) {
    const { params: { id, type } } = this.props.navigation.state;
    const { articleFilter: { loading: oldLoading } } = this.props;
    const { articleFilter: { data, loading: newLoading }, articleFiltered: { filters, loading } } = nextProps;
    
    if (oldLoading && !newLoading) this.getArticles(type, 1, id, this.getTerms(data, filters));
    if (data.length !== 0) this.setState({ isHeader: true });
    else this.setState({ isHeader: false });
    if (loading) {
      this.getArticles(type, 1, id, filters);
      this.getTerms(data, filters);
      this.applyArticleFilters({ filters, loading: false });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { fullSizeArticle } = nextProps;
    const { loading } = fullSizeArticle;
    const { page } = nextState;
    if (page === 1)
      this.setState({ loadingHeader: loading, loadingFooter: false });
    else
      this.setState({ loadingHeader: false, loadingFooter: loading });
  }

  getTerms = (data, filters) => {
    // const { articleFiltered: { filters } } = this.props;
    const tempArray = [];
    const subjectArray = [];
    const objSubject = {};
    let idSuject;
    _.forEach(data, item => {
      if (!objSubject[item.id]) {
        objSubject[item.id] = {};
        objSubject[item.id].id = item.id;
        objSubject[item.id].name = item.name;
        objSubject[item.id].terms = [];
        idSuject = item.id;
      }
      _.forEach(item.terms, subject => {
        const index = filters.indexOf(subject.id);
        if (index !== -1) {
          subjectArray.push(subject.name);
          objSubject[idSuject].terms.push(subject);
          tempArray.push(subject.id);
        }
      });
    });
    this.setState({ titleHeader: subjectArray });
    return tempArray;
  }

  renderItem = ({ item }) => (
    <Button onPress={() => showDetail(item, this.props)}>
      <ContentRow item={item} />
    </Button>
  );
  renderDescription = () => {
    const { titleHeader } = this.state;
    if (titleHeader.length !== 0)
      return (
        <View>
          <Text style={styles.descriptionEmpty1}>{I18n.t('home.swiper.emptyArticle.description_1')}</Text>
          <Text style={styles.descriptionEmpty2}>{I18n.t('home.swiper.emptyArticle.description_2')}</Text>
        </View>
      );
    return (
      <View>
        <Text style={styles.descriptionEmpty1}>{I18n.t('home.swiper.emptyArticle.description_1')}</Text>
        <Text style={styles.descriptionEmpty2}>{I18n.t('home.swiper.emptyArticle.description_3')}</Text>
      </View>
    );
  }
  renderEmpty = () => (
    <View style={styles.contentEmpty}>
      <View style={styles.container_img}>
        <Image
          source={require('app/assets/icons/no-results.png')}
          style={styles.img}
        />
      </View >
      {this.renderDescription()}
    </View>
  );

  render() {
    const { data, loading, hasMore } = this.props.fullSizeArticle;
    const { page, loadingHeader, loadingFooter, isHeader, titleHeader } = this.state;
    const { articleFilter: { loading: artLoading },navigation: { navigate, state: { params: { id } } } } = this.props;
    
    if (_.isEmpty(data) && !loading && !artLoading) return (
      <View style={styles.container}>
        <HeaderFilter id={id} navigate={navigate} titleHeader={titleHeader} visible={isHeader} />
        {this.renderEmpty()}
      </View>
    );
    return (
      <View style={styles.container}>
        <HeaderFilter navigate={navigate} titleHeader={titleHeader} visible={isHeader} />
        <View style={styles.content}>
          <FlatList
            ListFooterComponent={() => <LoadingPlaceholder visible={loadingFooter} />}
            ListHeaderComponent={() => <LoadingPlaceholder visible={loadingHeader} />}
            data={data}
            keyExtractor={({ id }) => id}
            onEndReached={() => {
              onEndReached(loading, hasMore, page, this.props);
              this.setState({ page : page + 1 });
            }}
            onEndReachedThreshold={0.1}
            onRefresh={() => {
              onRefresh(this.props);
              this.setState({ page : 1 });
            }}
            refreshing={false}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentEmpty: {
    flex: 1,
    width: 320,
    // justifyContent: 'center',
    alignSelf: 'center',
  },
  descriptionEmpty1: FontUtils.build({
    align: 'center',
    size: 17,
    marginBottom: 10,
    weight: 'semibold',
  }),
  descriptionEmpty2: FontUtils.build({
    align: 'center',
    size: 13,
    marginBottom: 10,
  }),
  container_img: {
    width: 60,
    height: 80,
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 40,
  },
  img: {
    flex: 1,
    resizeMode: 'contain',
  },
  // headerRight: {
  //   paddingRight: 15,
  // },
});
