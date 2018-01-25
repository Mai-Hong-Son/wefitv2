/**
 * @providesModule WeFit.Components.Reusables.LanguagesBox.LanguageButton
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import Button from 'react-native-button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

const FLAGS_MAPPING = {
  en: require('app/assets/flags/en.png'),
  vi: require('app/assets/flags/vi.png'),
};

export default class LanguageButton extends React.PureComponent {
  static propTypes = {
    code: PropTypes.string.isRequired,
    hasCarret: PropTypes.bool,
    name: PropTypes.string,
    onPress: PropTypes.func,
    style: ViewPropTypes.style,
  };

  static defaultProps = {
    onPress: null,
    hasCarret: false,
    name: null,
    style: false,
  };

  render() {
    const { code, hasCarret, name, onPress, style } = this.props;
    const { [code]: flag } = FLAGS_MAPPING;

    const content = (
      <View style={[styles.container, style]}>
        <Image source={flag} style={styles.flag} />
        {!_.isEmpty(name) && <Text numberOfLines={1} style={styles.name}>{name}</Text>}
        {hasCarret && (
          <FontAwesome color={COLORS.PINK} name="caret-down" size={28} style={styles.carret} />
        )}
      </View>
    );

    if (onPress == null) return content;
    return <Button onPress={onPress}>{content}</Button>;
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    backgroundColor: 'white',
    height: 44,
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  flag: {
    borderRadius: 4,
    height: 32,
    resizeMode: 'cover',
    width: 48,
  },
  name: FontUtils.build({
    color: COLORS.TRIPLE_6E,
    size: 17,

    // Extra
    flex: 1,
    marginLeft: 10,
  }),
  carret: {
    marginLeft: 10,
  },
});
