/**
 * @providesModule WeFit.Components.Home.Cards.ShadowCard
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import Button from 'react-native-button';
import { DeviceUtils, FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

const { width: SCREEN_WIDTH } = DeviceUtils.screen;

const ANIMATED_DURATION = 250;

export default class ShadowCard extends React.PureComponent {
  static propTypes = {
    canDismiss: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]),
    icon: Image.propTypes.source,
    onDismiss: PropTypes.func,
    onProcess: PropTypes.func,
    processText: PropTypes.string,
    title: PropTypes.string,
    touchable: PropTypes.bool,
  };
  
  static defaultProps = {
    canDismiss: false,
    children: null,
    icon: null,
    onDismiss: null,
    onProcess: null,
    processText: null,
    title: null,
    touchable: false,
  };

  constructor(props) {
    super(props);
    this.dismissOffset = new Animated.Value(0);
  }

  get containerStyles() {
    const opacity = this.dismissOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    
    const translateX = this.dismissOffset.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -SCREEN_WIDTH],
    });

    return [styles.container, { opacity, transform: [{ translateX }] }];
  }

  dismiss = () => {
    const timing = Animated.timing(this.dismissOffset, { duration: ANIMATED_DURATION, toValue: 1 });
    timing.start(() => {
      const { onDismiss } = this.props;
      onDismiss && onDismiss();

      // Reset dismiss offset
      this.dismissOffset.setValue(0);
    });
  };

  renderDismissButton = () => {
    const { canDismiss } = this.props;
    if (!canDismiss) return;
    
    return (
      <Button containerStyle={styles.dismissButton} onPress={this.dismiss}>
        <Image source={require('app/assets/feeds-icons/close.png')} />
      </Button>
    );
  };

  renderHeaderContent = () => {
    const { icon, title } = this.props;

    if (icon != null) return <Image source={icon} />;
    if (!_.isEmpty(title)) return <Text style={styles.title}>{title}</Text>;

    return <View />;
  };

  render() {
    const { children, onProcess, processText, touchable } = this.props;
    
    const processButton = !_.isEmpty(processText) && (
      <View style={styles.processContainer}>
        <TextButton fitContent onPress={onProcess} short title={processText} />
      </View>
    );

    return (
      <TouchableWithoutFeedback onPress={touchable ? onProcess : null}>
        <Animated.View style={this.containerStyles}>
          <View style={styles.headerContainer}>
            {this.renderHeaderContent()}
            {this.renderDismissButton()}
          </View>
          {children}
          {processButton}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.shadow,
    backgroundColor: 'white',
    borderRadius: 4,
    marginBottom: 16,
    marginHorizontal: 16,
    padding: 16,
  },
  headerContainer: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: FontUtils.build({
    color: COLORS.PURPLE,
    size: 14,
  }),
  dismissButton: {
  },

  processContainer: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'flex-end',
    marginTop: 10,
  },
});
