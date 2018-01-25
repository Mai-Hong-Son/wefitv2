/**
 * @providesModule WeFit.Components.Reusables.Loadings.LoadingImage
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View, ViewPropTypes } from 'react-native';
import Spinner from 'react-native-spinkit';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

export default class LoadingImage extends React.PureComponent {
  static propTypes = {
    ...Image.propTypes,
    containerStyle: ViewPropTypes.style,
    loadingColor: PropTypes.string,
    loadingSize: PropTypes.number,
    loadingType: PropTypes.string,
  };

  static defaultProps = {
    ...Image.defaultProps,
    containerStyle: null,
    loadingColor: 'white',
    loadingSize: 50,
    loadingType: 'Pulse',
  };

  state = { loadingVisible: true };

  onLoadEnd = () => this.setState({ loadingVisible: false });

  render() {
    const { containerStyle, loadingColor, loadingSize, loadingType, source, style } = this.props;
    const { loadingVisible } = this.state;

    return (
      <View style={[styles.container, containerStyle]}>
        <Image onLoadEnd={this.onLoadEnd} source={source} style={[SHEETS.absoluteFlex, style]} /> 
        <View style={styles.loadingContainer}>
          <Spinner
            color={loadingColor}
            isVisible={loadingVisible}
            size={loadingSize}
            type={loadingType}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  loadingContainer: {
    ...SHEETS.absoluteFlex,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
