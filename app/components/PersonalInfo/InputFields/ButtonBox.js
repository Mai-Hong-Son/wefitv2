/**
 * @providesModule WeFit.Components.PersonalInfo.InputFields.ButtonBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default class ButtonBox extends React.PureComponent {
  static propTypes = {
    buttonRef: PropTypes.func,
    mandatory: PropTypes.bool,
    onPress: PropTypes.func,
    placeholder: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.string,
  };

  static defaultProps = {
    buttonRef: null,
    mandatory: false,
    onPress: null,
    value: null,
  };

  render() {
    const { buttonRef, mandatory, onPress, placeholder, title, value } = this.props;
    const valueStyle = [styles.valueText, _.isEmpty(value) && styles.placeholderText];
    const valueText = _.isEmpty(value) ? placeholder : value;

    return (
      <View style={styles.container}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
          {mandatory && <Text style={styles.mandatoryDot}>{' •'}</Text>}
        </Text>
        <Button
          containerStyle={styles.buttonContainer}
          onPress={onPress}
          ref={ref => buttonRef && buttonRef(ref)}
        >
          <Text numberOfLines={1} style={valueStyle}>{valueText}</Text>
          <FontAwesome color={COLORS.PINK} name="caret-down" size={28} />
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginTop: 20,
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
  buttonContainer: {
    ...SHEETS.horizontalFlex,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderRadius: 4,
    flex: 1,
    height: 44,
    marginTop: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  valueText: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,

    // Extra
    flex: 1,
    marginRight: 10,
  }),
  placeholderText: {
    color: COLORS.TRIPLE_6E,
  },
});
