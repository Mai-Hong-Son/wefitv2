/**
 * @providesModule WeFit.Components.Reusables.SearchHeader
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DeviceUtils, FontUtils, SearchUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Utils
import { debounced } from 'app/utils';

export default class SearchHeader extends React.PureComponent {
  static propTypes = {
    onChangeValue: PropTypes.func,
    searchBoxRef: PropTypes.func,
  };

  static defaultProps = {
    onChangeValue: null,
    searchBoxRef: null,
  };

  onChangeText = text => {
    const { onChangeValue } = this.props;
    if (onChangeValue == null) return;

    const sanitizedText = SearchUtils.sanitize(text);
    onChangeValue({ rawSearchValue: text, searchValue: sanitizedText });
  }

  onClear = () => {
    this.searchBox.clear();
    this.onChangeText(null);
    this.searchBox.focus();
  };

  onRef = ref => {
    const { searchBoxRef } = this.props;
    this.searchBox = ref;
    searchBoxRef && searchBoxRef.bind(this)(ref);
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          autoCorrect={false}
          onChangeText={debounced(this.onChangeText)}
          placeholder={I18n.t('searchStudios.placeholder')}
          placeholderTextColor={COLORS.WHITE_OPAQUE_HALF}
          ref={this.onRef}
          style={styles.searchBox}
          underlineColorAndroid="transparent"
        />
        <Button onPress={this.onClear}>
          <FontAwesome color="white" name="close" size={16} />
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    backgroundColor: COLORS.WHITE_OPAQUE_MIN,
    borderRadius: 4,
    height: 30,
    justifyContent: 'space-between',
    marginLeft: 16,
    paddingRight: 10,
    width: Platform.select({
      android: DeviceUtils.screen.width - 48 - 16,
      ios: DeviceUtils.screen.width - 32 - 16,
    }),
  },

  searchBox: FontUtils.build({
    color: 'white',

    // Extra
    flex: 1,
    marginHorizontal: 10,
    padding: 0,
  }),
});
