/**
 * @providesModule WeFit.Components.Home.Articles.AnnouncementArticlesList
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, FlatList, Image } from 'react-native';
import _ from 'lodash';

// Components
// import Icon from 'react-native-vector-icons/Ionicons';

// Constants
// import { MAIN_ROUTES } from 'app/constants/RouteNames';


// Styles
import { DeviceUtils } from '@onaclover/react-native-utils';
// import { COLORS } from 'app/constants/AppStyles';

// Models
import Button from 'react-native-button';
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';
import { onEndReached, onRefresh, showDetail } from '../paginationArticles';
import withConnect from './withConnect';


const { width: SCREEN_WIDTH } = DeviceUtils.screen;

@withConnect
export default class AnnouncementArticlesList extends React.PureComponent {
  static navigationOptions = ({ navigation: { state: { params: { title } } } }) => ({
    title,
    // headerRight: <Icon color={COLORS.PINK} name="ios-search" size={27} style={styles.icon} />,
  });

  static propTypes = {
    announcements: PropTypes.object.isRequired,
    getArticles: PropTypes.func.isRequired,
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
    const { loading } = nextProps.announcements;
    const { page } = nextState;
    if (page === 1) {
      this.setState({ loadingHeader: loading, loadingFooter: false });
    } else {
      this.setState({ loadingHeader: false, loadingFooter: loading });
    }
  }

  renderItemOfAnnouncements = ({ item }) => {
    const { thumbnail } = item;

    return (
      <Button onPress={() => showDetail(item, this.props)}>
        <View style={styles.wrapItem}>
          <Image resizeMode="cover" source={{ uri: thumbnail }} style={styles.imageOfItem} />
        </View>
      </Button>
    );
  }
  
  render() {
    const { announcements } = this.props;
    const { data: announcement, loading, hasMore } = announcements;
    const { page, loadingHeader, loadingFooter } = this.state;

    if (_.isEmpty(announcement)) return null;

    return (
      <FlatList
        ListFooterComponent={() => <LoadingPlaceholder visible={loadingFooter} />}
        ListHeaderComponent={() => <LoadingPlaceholder visible={loadingHeader} />}
        contentContainerStyle={styles.container}
        data={announcement}
        keyExtractor={({ id }) => id}
        onEndReached={() => {
          onEndReached(loading, hasMore, page, this.props);
          this.setState({ page : page + 1 });
        }}
        onEndReachedThreshold={0}
        onRefresh={() => {
          onRefresh(this.props);
          this.setState({ page : 1 });
        }}
        refreshing={false}
        renderItem={({ item }) => this.renderItemOfAnnouncements({ item })}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  wrapItem: {
    height: SCREEN_WIDTH / 2.4,
    width: SCREEN_WIDTH,
    marginTop: 16,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  // icon: {
  //   marginRight: 16,
  // },
  imageOfItem: {
    position: 'absolute',
    top: 0,
    left: 16,
    bottom: 0,
    right: 16,
    borderRadius: 4,
  },
});
