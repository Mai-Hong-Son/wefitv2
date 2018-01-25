/**
 * @providesModule WeFit.Components.Home.Cards.WeFitTipsCard
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';

// Components
import SlidingTexts from 'app/components/Reusables/SlidingTexts';

// Constants
import { COLORS } from 'app/constants/AppStyles';

// Models
import Membership from 'app/models/Membership';
import StaticFeed from 'app/models/Feeds/StaticFeed';

// Locals
import ShadowCard from '../ShadowCard';
import withConnect from './withConnect';

const DELAY_DURATION = 30 * 1000; // 30s

@withConnect
export default class WeFitTipsCard extends React.PureComponent {
  static propTypes = {
    data: PropTypes.instanceOf(StaticFeed).isRequired,
    membership: PropTypes.instanceOf(Membership).isRequired,
  };

  render() {
    const { membership: { statusText } = {} } = this.props;
    const { activated, [statusText]: contents } = I18n.t('home.cards.wefitTips');

    return (
      <ShadowCard icon={require('app/assets/feeds-icons/newcomer.png')}>
        <SlidingTexts
          autoChange
          delay={DELAY_DURATION}
          loop
          presetContents={contents || activated}
          style={styles.contentText}
        />
      </ShadowCard>
    );
  }
}

const styles = StyleSheet.create({
  contentText: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,

    // Extra
    marginRight: -3,
    marginBottom: 5,
  }),
});
