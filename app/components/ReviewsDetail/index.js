/**
 * @providesModule WeFit.Components.ReviewsDetail
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
// import { Logger } from '@onaclover/react-native-utils';
// import _ from 'lodash';

// Components

// Constants
import { COLORS, HEADER_HEIGHT, NAVIGATION, SHEETS } from 'app/constants/AppStyles';
import { REVIEWS_DETAIL_TABS } from 'redux/constants';

// Models
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Locals
import RatingsCard from './RatingsCard';
import ReviewsDetailTabs from './ReviewsDetailTabs';
import ReviewsList from './ReviewsList';

export default class ReviewsDetail extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { goBack, state: { params: { session, studio } } } = navigation;
    const { name: title } = session || studio;

    return {
      title,
      headerLeft: (
        <HeaderBackButton
          onPress={() => goBack()}
          pressColorAndroid="transparent"
          tintColor={COLORS.PINK}
        />
      ),
      headerStyle: NAVIGATION.transparentHeader,
    };
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          session: PropTypes.instanceOf(Session),
          studio: PropTypes.instanceOf(Studio),
        }).isRequired,
      }).isRequired,
    }).isRequired,
  };

  get passedProps() {
    const { session, studio } = this.props.navigation.state.params;
    return { session, studio };
  }

  render() {
    const { session, studio } = this.passedProps;
    const { ratingStatus } = session || studio;

    return (
      <View style={SHEETS.container}>
        <LinearGradient {...COLORS.BACKGROUND_GRADIENT} style={styles.headerBackground} />
        <RatingsCard ratingStatus={ratingStatus} />
        {session != null && studio != null
          ? <ReviewsDetailTabs session={session} studio={studio} />
          : <ReviewsList route={{ key: REVIEWS_DETAIL_TABS.STUDIO, studio }} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerBackground: {
    height: 176 + HEADER_HEIGHT,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
