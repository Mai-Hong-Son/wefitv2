/**
 * @providesModule WeFit.Components.Home.InternalWebBrowser.Favorite
 */
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import Button from 'react-native-button';
import { COLORS } from 'app/constants/AppStyles';
import { FontUtils } from '@onaclover/react-native-utils';
import ShareButton from './ShareButton';

import withConnect from './withConnect';

@withConnect
export default class Favorite extends React.PureComponent {
  static propTypes = {
    addFavorite: PropTypes.func.isRequired,
    articleDetail: PropTypes.shape({
      data: PropTypes.shape({
        id: PropTypes.number.isRequired,
        bookmarked: PropTypes.bool,
        tags: PropTypes.array,
      }),
    }).isRequired,
    deleteFavorite: PropTypes.func.isRequired,
    getArticleDetail: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,    
    uri: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.addFavorite = this.props.addFavorite.bind(this);
    this.deleteFavorite = this.props.deleteFavorite.bind(this);
    this.getArticleDetail = this.props.getArticleDetail.bind(this);
    this.state = { color: 'white', mark: false, nameIcon: 'heart-outlined', tagsArticle: [] };
  }
  componentDidMount() {
    const { id } = this.props;
    this.getArticleDetail(id);
  }

  componentWillReceiveProps(nextProps) {
    const { data, loading } = nextProps.articleDetail;
    if (data) {
      const { bookmarked, tags } = data;
      if (bookmarked)
        this.setState({ color: COLORS.PINK, mark: bookmarked, nameIcon: 'heart', tagsArticle: tags });
      else
        this.setState({ color: 'white', mark: bookmarked, nameIcon: 'heart-outlined', tagsArticle: tags });
      if (loading)
        this.setState({ color: 'white', mark: bookmarked, nameIcon: 'heart-outlined', tagsArticle: [] });
    }
  }

  renderTags = ({ item }) => (
    <View style={styles.tag}>
      <Text style={styles.contentCategory}>{item.toUpperCase()} </Text>
    </View>
  );

  addDeleteFavorite = () => {
    const { id } = this.props.articleDetail.data;
    const { mark } = this.state;
    if (mark) {
      this.deleteFavorite(id);
      this.setState({ color: 'white', mark: false, nameIcon: 'heart-outlined' });
    } else {
      this.addFavorite(id);
      this.setState({ color: COLORS.PINK, mark: true, nameIcon: 'heart' });
    }
  }
  
  render() {
    const { color, nameIcon } = this.state;
    const { tagsArticle } = this.state;
    const { title, uri } = this.props;
  
    return (
      <View style={styles.header}>
        <View style={styles.listTags}>
          <FlatList
            data={tagsArticle}
            keyExtractor={item => item}
            numColumns={5}
            renderItem={this.renderTags}
          />
        </View>
        <View style={styles.iconFavorite}>
          <Button
            onPress={() => {this.addDeleteFavorite();}}
          >
            <Entypo color={color} name={nameIcon} size={23} />
          </Button>
        </View>
        <ShareButton title={title} uri={uri} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.PURPLE,
    height: 44,
    flexDirection: 'row',
  },
  listTags: {
    flex: 5,
  },
  tag: {
    backgroundColor: COLORS.PINK,
    borderRadius:4,
    marginLeft: 10,
    marginTop: 12,
  },
  contentCategory: FontUtils.build({
    paddingLeft: 5,
    size: 13,
    color: 'white',
    weight: 'semibold',
  }),
  iconFavorite: {
    flex: 2,
    marginTop: 10,
    alignItems: 'flex-end',
  },
});
