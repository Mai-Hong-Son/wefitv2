/**
 * @providesModule WeFit.Components.Home.Articles.RecommendedArticlesList
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, FlatList, Image } from 'react-native';
import _ from 'lodash';

// Components
// import Icon from 'react-native-vector-icons/Ionicons';

// Constants
// import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Styles
import { FontUtils, DeviceUtils } from '@onaclover/react-native-utils';
import { COLORS } from 'app/constants/AppStyles';

// Models
import Button from 'react-native-button';
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings'; 

// Locals
import { onEndReached, onRefresh, showDetail } from '../paginationArticles';
import withConnect from './withConnect';


const { width: SCREEN_WIDTH } = DeviceUtils.screen;

@withConnect
export default class RecommendedArticlesList extends React.PureComponent {
  static navigationOptions = ({ navigation: { state: { params: { title } } } }) => ({
    title,
    // headerRight: <Icon color={COLORS.PINK} name="ios-search" size={27} style={styles.iconRightHeader} />,
  });

  static propTypes = {
    getArticles: PropTypes.func.isRequired,
    halfSizeArticle: PropTypes.object.isRequired,
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

    this.getArticles = this.props.getArticles.bind(this);
    this.state = { page: 1, loadingHeader: true, loadingFooter: false };
  }

  componentDidMount() {
    const { params: { type } } = this.props.navigation.state;
    this.getArticles(type, 1);
  }

  componentWillUpdate(nextProps, nextState) {
    const { loading } = nextProps.halfSizeArticle;
    const { page } = nextState;
    if (page === 1) {
      this.setState({ loadingHeader: loading, loadingFooter: false });
    } else {
      this.setState({ loadingHeader: false, loadingFooter: loading });
    }
  }

  renderItemOfRecommendeds = ({ item }) => {
    const { title, thumbnail } = item;
    return (
      <Button onPress={() => showDetail(item, this.props)}>
        <View style={styles.wrapItem}>
          <Image source={{ uri: thumbnail }} style={styles.imageOfItem} />
          <View style={styles.wrapTextOfItem}>
            <Text numberOfLines={2} style={styles.textOfItem}>{title}</Text>
          </View>
        </View>
      </Button>
    );
  }
  
  render() {
    const { halfSizeArticle } = this.props;
    const { data: recommendeds, loading, hasMore } = halfSizeArticle;
    const { page, loadingHeader, loadingFooter } = this.state;

    if (_.isEmpty(recommendeds)) return null;

    return (
      <FlatList
        ListFooterComponent={() => <LoadingPlaceholder visible={loadingFooter} />}
        ListHeaderComponent={() => <LoadingPlaceholder visible={loadingHeader} />}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.container}
        data={recommendeds}
        keyExtractor={({ id }) => id}
        numColumns={2}
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
        renderItem={({ item }) => this.renderItemOfRecommendeds({ item })}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  column: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    paddingRight: 16,
    paddingLeft: 16,    
  },
  wrapItem: {
    flex: 1,
    marginTop: 17,
    alignItems: 'center',
    marginBottom: 3,
  },
  // iconRightHeader: {
  //   paddingRight: 30,
  // },
  imageOfItem: {
    height: SCREEN_WIDTH / 2.3,
    width: SCREEN_WIDTH / 2.3,
    borderRadius: 4,
  },
  wrapTextOfItem: {
    height: 45,
    width: SCREEN_WIDTH / 2.3,
    marginTop: 10,
  },
  textOfItem: FontUtils.build({
    color: COLORS.WEFIT,
    size: 14,
  }),
});
