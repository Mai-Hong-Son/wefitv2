/**
 * @providesModule WeFit.Components.PersonalInfo.InputFields.InputBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS } from 'app/constants/AppStyles';

export default class InputBox extends React.PureComponent {
  static propTypes = {
    ...TextInput.propTypes,
    flexSize: PropTypes.bool,
    mandatory: PropTypes.bool,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    ...TextInput.defaultProps,
    autoCapitalize: 'none',
    autoCorrect: false,
    autoFocus: false,
    blurOnSubmit: true,
    clearButtonMode: 'while-editing',
    editable: true,
    flexSize: false,
    mandatory: false,
    placeholderTextColor: COLORS.ALL_C,
    returnKeyType: 'next',
    selectTextOnFocus: true,
    selectionColor: COLORS.PINK,
    underlineColorAndroid: 'transparent',
  };

  focus = () => this.textInput.focus();

  render() {
    const { flexSize, editable, mandatory, title } = this.props;
    
    return (
      <View style={[styles.container, flexSize && styles.containerFlex]}>
        <Text style={styles.title}>
          {title}
          {mandatory && <Text style={styles.mandatoryDot}>{' •'}</Text>}
        </Text>
        <TextInput
          {...this.props}
          ref={ref => this.textInput = ref}
          style={[styles.input, !editable && styles.inputDisabled]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginTop: 20,
  },
  containerFlex: {
    flex: 1,
  },
  title: FontUtils.build({
    color: 'white',
    size: 14,
  }),
  mandatoryDot: FontUtils.build({
    color: COLORS.PINK,
    size: 18,
  }),
  input: FontUtils.build({
    background: 'white',
    color: COLORS.WEFIT,
    size: 17,

    // Extra
    alignSelf: 'stretch',
    borderRadius: 4,
    height: 44,
    marginTop: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
  }),
  inputDisabled: {
    color: COLORS.ALL_C,
  },
});
