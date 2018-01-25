/**
 * @providesModule WeFit.Components.Home.Articles.TrainingArticles.ContentRow
 */
import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

export default class ContentRow extends React.PureComponent {
  static propTypes = {
    item: PropTypes.shape({
      thumbnail: PropTypes.string.isRequired,
      title: PropTypes.string,
      author: PropTypes.string,
      tags: PropTypes.array,
    }).isRequired,
  };

  renderTags = ({ item }) => (
    <View style={styles.tag}>
      <Text style={styles.contentCategory}>{item.toUpperCase()} </Text>
    </View>
  );
  
  render() {
    const authorTag = I18n.t('home.swiper.author');
    const { thumbnail, title, author, tags } = this.props.item;
    return (
      <View style={styles.container}>
        <View style={styles.containerThumbnail}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
        </View >
        <View style={styles.description}>
          <View style={styles.contentContainer}>
            <Text numberOfLines={2} style={styles.title}>{title}</Text>
            <Text style={styles.auth}>{`${authorTag}: ${author || 'Wefit'}` }</Text>
            <View style={styles.category}>
              <FlatList
                data={tags}
                keyExtractor={item => item}
                numColumns={5}
                renderItem={this.renderTags}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 142,
    flexDirection: 'row',
    borderBottomColor: '#95989a',
    borderBottomWidth: 1,
  },
  title: FontUtils.build({
    color: 'black',
    size: 17,
    alignSelf: 'flex-start',
  }),
  containerThumbnail: {
    flex: 1,
    justifyContent: 'center',
  },
  thumbnail: {
    width: 80, 
    height: 110,
    borderRadius:2,
    alignContent: 'center',
    alignSelf: 'center',
  },
  description: {
    flex: 2,
    alignContent: 'center',
    alignSelf: 'center',
  },
  contentContainer: {
    height: 110,
    width: 200, 
  },
  auth: FontUtils.build({
    color: '#666',
    marginTop: 10,
    size: 14,
  }),
  category: {
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#83358b',
    borderRadius:4,
    marginRight: 5,
    alignItems: 'flex-start',
  },
  contentCategory: FontUtils.build({
    paddingLeft: 5,
    size: 12,
    color: 'white',
    weight: 'semibold',
  }),
});
