/**
 * @providesModule WeFit.Components.SearchStudios.DataRow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Button from 'react-native-button';
import Highlighter from 'react-native-highlight-words';
import { FontUtils, SearchUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import Studio from 'app/models/Studio';

export default function DataRow({ onSelect, searchValue, studio }) {
  return (
    <Button containerStyle={styles.container} onPress={() => onSelect(studio)}>
      <Highlighter
        highlightStyle={styles.textHighlight}
        sanitize={text => SearchUtils.sanitize(text, false)}
        searchWords={searchValue.split(/[^a-z0-9]+/)}
        style={styles.text}
        textToHighlight={studio.name}
      />
    </Button>
  );
}

DataRow.propTypes = {
  onSelect: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  studio: PropTypes.instanceOf(Studio).isRequired,
};

DataRow.defaultProps = {
  searchValue: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    borderBottomColor: COLORS.ALL_C,
    borderBottomWidth: 1,
    height: 44,
    justifyContent: 'flex-start',
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  text: FontUtils.build({
    size: 17,
    color: COLORS.TRIPLE_6E,
  }),
  textHighlight: FontUtils.build({
    color: COLORS.PINK,
    size: 17,
  }),
});
