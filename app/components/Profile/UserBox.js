/**
 * @providesModule WeFit.Components.Profile.UserBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import LinearGradient from 'react-native-linear-gradient';
import { FontUtils } from '@onaclover/react-native-utils';

// Components
import MembershipStatus from 'app/components/Reusables/MembershipStatus';
import UserAvatar from 'app/components/Reusables/UserAvatar';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

// Models
import Membership from 'app/models/Membership';
import User from 'app/models/User';

export default function UserBox({ membership, onOpenSettings, userData }) {
  const { expireStats } = membership;
  const { avatar, name } = userData;

  return (
    <LinearGradient {...COLORS.BACKGROUND_GRADIENT} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <UserAvatar uri={avatar} />
        <MembershipStatus
          expireStats={expireStats}
          templates={I18n.t('profile.membershipStatus')}
        />
      </View>
      <Button containerStyle={styles.settingsButton} onPress={onOpenSettings}>
        <Image source={require('app/assets/icons/settings.png')} />
      </Button>
    </LinearGradient>
  );
}

UserBox.propTypes = {
  membership: PropTypes.instanceOf(Membership).isRequired,
  onOpenSettings: PropTypes.func.isRequired,
  userData: PropTypes.instanceOf(User).isRequired,
};

const styles = StyleSheet.create({
  container: {
    ...SHEETS.stretched,
    height: 250,
    paddingVertical: 20,
  },

  content: {
    ...SHEETS.container,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
  },

  name: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 17,
    weight: 'semibold',
  }),

  settingsButton: {
    position: 'absolute',
    top: 31,
    right: 16,
  },
});
