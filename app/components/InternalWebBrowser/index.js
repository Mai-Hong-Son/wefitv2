/**
 * @providesModule WeFit.Components.Home.InternalWebBrowser
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { FEED_TYPES } from 'redux/constants';
// Components
import InteractiveWebView from 'app/components/Reusables/InteractiveWebView';
import Favorite from './Favorite';
import ShareContentArticle from './ShareContentArticle';
const {
  // ANNOUNCEMENTS,
  FULL_SIZE_ARTICLES,
  // HALF_SIZE_ARTICLES,
} = FEED_TYPES;

export default class InternalWebBrowser extends React.PureComponent {
  static navigationOptions = ({ navigation: { state: { params: { title } } } }) => ({
    title,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          title: PropTypes.string.isRequired,
          uri: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
          type: PropTypes.string,
        }),
      }).isRequired,
    }).isRequired,
  };

  get passedProps() {
    const { title, uri, type, id } = this.props.navigation.state.params;
    return { title, uri, type, id };
  }

  render() {
    const { uri, type, id, title } = this.passedProps;
    if (type !== FULL_SIZE_ARTICLES) 
      return (
        <View style={styles.content}>
          <ShareContentArticle title={title} uri={uri} />
          <InteractiveWebView uri={uri} />
        </View>
      );
    else
      return (
        <View style={styles.content}>
          <Favorite id={id} title={title} uri={uri} />
          <InteractiveWebView uri={uri} />
        </View>
      );
  }
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
