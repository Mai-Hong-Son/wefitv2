/**
 * @providesModule WeFit.Components.Profile
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, View } from 'react-native';
import I18n from 'react-native-i18n';
import { DeviceUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Constants
import { SHEETS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
import Membership from 'app/models/Membership';
import User from 'app/models/User';

// Locals
import MenuItem from './MenuItem';
import UserBox from './UserBox';
import withConnect from './withConnect';

const {
  FAVORITE_STUDIOS, PERSONAL_INFO, PURCHASE_ONLINE, REDEEM_MEMBERSHIP, REFERRAL,
} = MAIN_ROUTES;

@withConnect
export default class Profile extends React.PureComponent {
  static propTypes = {
    membership: PropTypes.instanceOf(Membership).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    userData: PropTypes.instanceOf(User).isRequired,
  };

  get menuOptions() {
    const { membership } = this.props;
    if (membership == null) return [];

    const {
      favoriteStudios, personalInfo, purchaseOnline, redeemMembership, referral,
    } = I18n.t('profile.menuOptions');

    return _.compact([
      {
        icon: require('app/assets/profile-icons/redeem-membership.png'),
        routeName: REDEEM_MEMBERSHIP,
        title: redeemMembership,
      },
      {
        icon: require('app/assets/profile-icons/purchase-online.png'),
        routeName: PURCHASE_ONLINE,
        title: purchaseOnline,
      },
      {
        icon: require('app/assets/profile-icons/personal-info.png'),
        routeName: PERSONAL_INFO,
        title: personalInfo,
      },
      {
        icon: require('app/assets/profile-icons/favorite-studios.png'),
        routeName: FAVORITE_STUDIOS,
        title: favoriteStudios,
      },
      {
        icon: require('app/assets/profile-icons/referral.png'),
        title: referral,
        routeName: REFERRAL,
      },
    ]);
  }

  onNavigate = routeName => {
    if (routeName == null) return;

    const { navigation: { navigate } } = this.props;
    navigate(routeName);
  }

  onOpenSettings = () => {
    const { navigation: { navigate } } = this.props;
    navigate(MAIN_ROUTES.SETTINGS);
  }

  render() {
    const { membership, userData } = this.props;
    const enabledMenuItems = _.filter(this.menuOptions, ({ routeName }) => routeName != null);

    return (
      <View style={SHEETS.container}>
        <UserBox membership={membership} onOpenSettings={this.onOpenSettings} userData={userData} />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          {_.map(enabledMenuItems, ({ icon, routeName, title }, index) => (
            <MenuItem
              icon={icon}
              key={`menu_item_${index}`}
              onPress={() => this.onNavigate(routeName)}
              title={title}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: DeviceUtils.screen.width,
  },
  content: {
    paddingTop: 20,
  },
});
