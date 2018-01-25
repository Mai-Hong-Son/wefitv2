/**
 * @providesModule WeFit.Components.Home.Cards.StaticCard
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { FEED_TYPES } from 'redux/constants';

// Models
import StaticFeed from 'app/models/Feeds/StaticFeed';

// Locals
import ShadowCard from './ShadowCard';

const { NEWCOMER, PENDING_ORDER } = FEED_TYPES;

const ICONS_MAPPING = {
  [NEWCOMER]: require('app/assets/feeds-icons/newcomer.png'),
  [PENDING_ORDER]: require('app/assets/feeds-icons/pending-order.png'),
};

export default function StaticCard({ data, onDismiss, onProcess }) {
  const { type } = data;
  const { processText, text } = I18n.t(`home.cards.${_.camelCase(type)}`);
  const { [type]: icon } = ICONS_MAPPING;

  return (
    <ShadowCard
      canDismiss={type === PENDING_ORDER}
      icon={icon}
      onDismiss={() => onDismiss && onDismiss(data)}
      onProcess={() => onProcess && onProcess(data)}
      processText={processText}
    >
      <Text style={styles.text}>{text}</Text>
    </ShadowCard>
  );
}

StaticCard.propTypes = {
  data: PropTypes.instanceOf(StaticFeed).isRequired,
  onDismiss: PropTypes.func,
  onProcess: PropTypes.func,
};

StaticCard.defaultProps = {
  onDismiss: null,
  onProcess: null,
};

const styles = StyleSheet.create({
  text: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,

    // Extra
    marginRight: -3,
    marginBottom: 5,
  }),
});
