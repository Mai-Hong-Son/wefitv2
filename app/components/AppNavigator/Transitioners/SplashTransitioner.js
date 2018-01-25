/**
 * @providesModule WeFit.Components.AppNavigator.Transitioners.SplashTransitioner
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Transitioner } from 'react-navigation';
import { DeviceUtils } from '@onaclover/react-native-utils';

export default class SplashTransitioner extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({}).isRequired,
    router: PropTypes.object.isRequired,
  };

  configureTransition = () => ({ duration: 500, easing: Easing.quad, timing: Animated.timing });

  renderContent = transition => {
    const scenes = transition.scenes.map(scene => this.renderScene(transition, scene));
    return <View>{scenes}</View>;
  };

  renderScene = (transition, scene) => {
    const { navigation, router } = this.props;
    const { position } = transition;
    const { index, route: { key, routeName } } = scene;
    
    const opacity = position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0, 1, 0],
    });

    const Scene = router.getComponentForRouteName(routeName);

    return (
      <Animated.View key={key} style={[styles.scene, { opacity }]}>
        <Scene navigation={navigation} sceneIndex={index} transition={transition} />
      </Animated.View>
    );
  };

  render() {
    return (
      <Transitioner
        configureTransition={this.configureTransition}
        navigation={this.props.navigation}
        onTransitionEnd={this.onTransitionEnd}
        onTransitionStart={this.onTransitionStart}
        render={this.renderContent}
      />
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    left: 0,
    position: 'absolute',
    top: 0,
    ...DeviceUtils.screen,
  },
});
