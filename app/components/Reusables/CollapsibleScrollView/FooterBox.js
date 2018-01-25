/**
 * @providesModule WeFit.Components.Reusables.CollapsibleScrollView.FooterBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

export default function FooterBox({
  clearTitle, disabledSubmit, loading, onClear, onSubmit, submitTitle,
}) {
  return (
    <View style={styles.container}>
      {!_.isEmpty(clearTitle) && (
        <TextButton
          bordering
          containerStyle={styles.clearButton}
          onPress={onClear}
          title={clearTitle}
        />
      )}
      <TextButton
        disabled={disabledSubmit}
        flexSize
        loading={loading}
        onPress={onSubmit}
        title={submitTitle}
      />
    </View>
  );
}

FooterBox.propTypes = {
  clearTitle: PropTypes.string,
  disabledSubmit: PropTypes.bool,
  loading: PropTypes.bool,
  onClear: PropTypes.func,
  onSubmit: PropTypes.func,
  submitTitle: PropTypes.string.isRequired,
};

FooterBox.defaultProps = {
  clearTitle: null,
  disabledSubmit: false,
  loading: false,
  onClear: null,
  onSubmit: null,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.horizontalFlex,
    justifyContent: 'space-between',
    padding: 16,
  },
  clearButton: {
    marginRight: 16,
  },
});
