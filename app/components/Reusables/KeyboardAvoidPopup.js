/**
 * @providesModule WeFit.Components.Reusables.KeyboardAvoidPopup
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

export default class KeyboardAvoidPopup extends React.PureComponent {
  static propTypes = {
    backgroundColor: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]).isRequired,
  };

  static defaultProps = {
    backgroundColor: null,
  };

  constructor(props) {
    super(props);

    this.visibleOffset = new Animated.Value(0);
    this.state = { visible: false };
  }

  dismiss = () => this.setState({ visible: false });
  show = () => this.setState({ visible: true });

  render() {
    const { backgroundColor, children, ...passedProps } = this.props;
    const { visible } = this.state;

    return (
      <Modal animationType="fade" onRequestClose={this.dismiss} transparent visible={visible}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="always"
          {...passedProps}
        >
          <TouchableWithoutFeedback onPress={this.dismiss}>
            <View style={[styles.background, { backgroundColor }]} />
          </TouchableWithoutFeedback> 
          {children}
        </KeyboardAwareScrollView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
  },
  background: {
    alignSelf: 'stretch',
    flex: 1,
  },
});
