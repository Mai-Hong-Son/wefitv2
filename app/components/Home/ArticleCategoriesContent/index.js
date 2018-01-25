/**
 * @providesModule WeFit.Components.Home.ArticleCategoriesContent.index
 */
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import _ from 'lodash';
import I18n from 'react-native-i18n';
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';
import ContentRow from './ContentRow';
import withConnect from './withConnect';

const { ARTICLE_TRAININGS_LIST } = MAIN_ROUTES;

@withConnect
export default class ArticleCategoriesContent extends React.PureComponent {
  static navigationOptions = ({ navigation: { state: { params: { title } } } }) => ({
    title,
  });

  static propTypes = {
    articleCategories: PropTypes.object.isRequired,
    getArticleCategories: PropTypes.func.isRequired,
    getArticlesFilter: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          title: PropTypes.string.isRequired,
          type: PropTypes.string.isRequired,
        }),
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.getArticleCategories = this.props.getArticleCategories.bind(this);
    this.getArticlesFilter = this.props.getArticlesFilter.bind(this);
  }

  componentDidMount() {
    const { params: { type } } = this.props.navigation.state;
    this.getArticleCategories(type);
  }


  dispatchCategory = item => {
    const { navigation: { navigate, state: { params: { type } } } } = this.props;
    const { name :title, id } = item;
    navigate(ARTICLE_TRAININGS_LIST, { title, id, type });
  }

  dispatchFavorite = item => {
    const { navigation: { navigate } } = this.props;
    const { name : title, type } = item;
    navigate(ARTICLE_TRAININGS_LIST, { title, type });
  }

  renderItem = ({ item }) => (
    <Button
      onPress={() => {
        this.dispatchCategory(item);
        this.getArticlesFilter(item.id);
      }}
    >
      <ContentRow item={item} />
    </Button>
  );

  footerComponent = () => {
    const { favourited } = I18n.t('home.swiper');
    const item = {
      name: favourited,
      image: 'https://d2ihqxg65zn459.cloudfront.net/images/fav.png',
      gradient: ['#EBC665', '#83358B'],
      type: 'bookmarks',
    };
    return (
      <Button onPress={() => this.dispatchFavorite(item)}>
        <ContentRow item={item} />
      </Button>
    );
  };
  render() {
    const { data, loading } = this.props.articleCategories;
    if (_.isEmpty(data)) return null;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <FlatList
            ListFooterComponent={this.footerComponent()}
            ListHeaderComponent={() => <LoadingPlaceholder visible={loading} />}
            data={data}
            keyExtractor={({ id }) => id}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WEFIT,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
