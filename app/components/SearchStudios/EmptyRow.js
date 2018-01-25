/**
 * @providesModule WeFit.Components.SearchStudios.EmptyRow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import HighlightText from 'app/components/Reusables/HighlightText';

// Constants
import { COLORS } from 'app/constants/AppStyles';

export default function EmptyRow({ rawSearchValue }) {
  const { noResult, noResultFor } = I18n.t('searchStudios');
  const template = _.isEmpty(rawSearchValue) ? noResult : noResultFor;

  return (
    <View style={styles.container}>
      <HighlightText highlightWords={[rawSearchValue]} style={styles.text} template={template} />
    </View>
  );
}

EmptyRow.propTypes = {
  rawSearchValue: PropTypes.string,
};

EmptyRow.defaultProps = {
  rawSearchValue: null,
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    color: COLORS.TRIPLE_6E,
  },
});
