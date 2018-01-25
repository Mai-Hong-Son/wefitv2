/**
 * @providesModule WeFit.Components.Home.InternalWebBrowser.ShareButton
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Entypo from 'react-native-vector-icons/Entypo';
import Button from 'react-native-button';
import { ShareDialog } from 'react-native-fbsdk';

export default class ShareButton extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,    
    uri: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { shareLinkContent: {} };
  }

  onShareLinkContent = () => {
    const { uri, title } = this.props;

    const linkContent = {
      contentType: 'link',
      contentUrl: uri,
      contentDescription: title,
    };

    this.setState({
      shareLinkContent: linkContent,
    }, () => this.shareArticle());
  }

  shareArticle = () => {
    const tmp = this;
    ShareDialog.canShow(this.state.shareLinkContent).then(
      canShow => {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      }
    );
  }
  
  render() {
    return (
      <View style={styles.iconShare}>
        <Button
          onPress={() => {this.onShareLinkContent();}}
        >
          <Entypo color={'#ffffff'} name={'share'} size={23} />
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  iconShare: {
    flex: 1,
    marginTop: 10,
    alignItems: 'flex-end',
    paddingRight: 16,
  },
});
