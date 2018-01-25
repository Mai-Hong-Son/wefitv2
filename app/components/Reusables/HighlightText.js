/**
 * @providesModule WeFit.Components.Reusables.HighlightText
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import Highlighter from 'react-native-highlight-words';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Utils
import { formatText } from 'app/utils';

export default function HighlightText({ align, highlightWords, style, styleHighlight, template }) {
  const textStyles = [
    styles.text,
    align != null && { textAlign: align },
    style,
  ];
  
  return (
    <Highlighter
      highlightStyle={[styles.textHighlight, styleHighlight]}
      searchWords={highlightWords}
      style={textStyles}
      textToHighlight={formatText(template, ...highlightWords)}
    />
  );
}

HighlightText.propTypes = {
  align: PropTypes.string,
  highlightWords: PropTypes.arrayOf(PropTypes.string),
  style: Text.propTypes.style,
  styleHighlight: Text.propTypes.style,
  template: PropTypes.string,
};

HighlightText.defaultProps = {
  align: 'center',
  highlightWords: [],
  style: null,
  styleHighlight: null,
  template: null,
};

const styles = StyleSheet.create({
  text: FontUtils.build({
    color: 'white',
    size: 17,
  }),
  textHighlight: FontUtils.build({
    color: COLORS.PINK,
    size: 17,
    weight: 'semibold',
  }),
});
