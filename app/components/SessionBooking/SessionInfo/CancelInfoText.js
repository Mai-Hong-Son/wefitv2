/**
 * @providesModule WeFit.Components.SessionBooking.SessionInfo.CancelInfoText
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';

import HighlightText from 'app/components/Reusables/HighlightText';

// Models
import Session from 'app/models/Session';

export default function CancelInfoText({ session }) {
  const eta = session.buildEtaText(I18n.t('formats.etaTexts'));

  return (
    <View style={styles.container}>
      <HighlightText
        highlightWords={[eta]}
        style={styles.infoText}
        template={I18n.t('sessionBooking.confirmCancel')}
      />
    </View>
  );
}

CancelInfoText.propTypes = {
  session: PropTypes.instanceOf(Session).isRequired,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 46,
    marginTop: 25,
  },
  infoText: {
    marginTop: 4,
  },
});
