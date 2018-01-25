/**
 * @providesModule WeFit.Components.InteractiveWebView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, WebView, View } from 'react-native';
import _ from 'lodash';

// Components
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Utils
import { patchPostMessageJsCode } from 'app/utils';

export default class InteractiveWebView extends React.PureComponent {
  static propTypes = {
    onMessage: PropTypes.func,
    uri: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onMessage: null,
  };

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  onNavigationStateChange = nextState => {
    const { loading } = this.state;
    const { loading: nextLoading, title } = nextState;
    
    // Initial state, but `nextLoading` still false
    if (_.isEmpty(title)) return;

    // nextLoading changed to true, show loading indicator immediately
    if (!loading && nextLoading) {
      this.setState({ loading: true });
      return;
    }
    
    // nextLoading changed to false, show loading indicator after delay of 500ms
    if (loading && !nextLoading) {
      setTimeout(() => this.setState({ loading: false }), 500);
      return;
    }
  };
  
  render() {
    const { onMessage, uri } = this.props;
    const { loading } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <WebView
            injectedJavaScript={patchPostMessageJsCode}
            onMessage={onMessage}
            onNavigationStateChange={this.onNavigationStateChange}
            ref={ref => this.webView = ref}
            source={{ uri }}
          />
        </View>
        {loading && <LoadingPlaceholder style={styles.loadingPlaceholder} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: COLORS.WEFIT,
  },
  content: {
    ...SHEETS.horizontalFlex,
    flex: 1,
  },
  loadingPlaceholder: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
