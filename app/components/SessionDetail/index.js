/**
 * @providesModule WeFit.Components.SessionDetail
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, View } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import I18n from 'react-native-i18n';
import { DeviceUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { LoadingPlaceholder } from 'app/components/Reusables/Loadings';
import FadedNavigationHeader from 'app/components/Reusables/FadedNavigationHeader';
import ParallaxScrollView from 'app/components/Reusables/ParallaxScrollView';
import WarningBox, { variants as WarningBoxVariants } from 'app/components/Reusables/WarningBox';
import { modes as SessionBookingModes } from 'app/components/SessionBooking';
import {
  FloatingButton, GalleryBox, HeaderRightButtons, MapBox, QuickInfoBox, TextInfoBox,
} from 'app/components/Reusables/DetailScrollView';

// Constants
import { COLORS, NAVIGATION, PARALLAX_HEIGHT, SHEETS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';
import { FCM_NOTIFICATION_TYPES } from 'redux/constants';

// Models
import { Amenity, FitnessType } from 'app/models/BaseStaticData';
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Locals
import FooterBox from './FooterBox';
import TitleBox from './TitleBox';
import withConnect from './withConnect';

const {
  MY_SESSIONS, OVERALL_SCHEDULES, SESSION_BOOKING, STUDIO_SCHEDULES,
} = MAIN_ROUTES;
const { CHECKED_IN } = FCM_NOTIFICATION_TYPES;

@withConnect
export default class SessionDetail extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { goBack, state: { params: { session, studio } } } = navigation;
    const onBack = () => goBack();

    return {
      headerLeft: <HeaderBackButton onPress={onBack} pressColorAndroid="white" tintColor="white" />,
      headerRight: <HeaderRightButtons session={session} studio={studio} />,
      headerStyle: NAVIGATION.transparentHeader,
    };
  };

  static propTypes = {
    amenities: PropTypes.arrayOf(PropTypes.instanceOf(Amenity)).isRequired,
    fitnessTypeIndices: PropTypes.objectOf(PropTypes.number).isRequired,
    fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      setParams: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          session: PropTypes.instanceOf(Session).isRequired,
          studio: PropTypes.instanceOf(Studio).isRequired,
          variant: PropTypes.oneOf([MY_SESSIONS, OVERALL_SCHEDULES, STUDIO_SCHEDULES]).isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    receivedNotification: PropTypes.shape({
      payload: PropTypes.object,
      type: PropTypes.string,
    }),
  };

  static defaultProps = {
    receivedNotification: null,
  };

  constructor(props) {
    super(props);

    this.mapBox = null;
    this.transitionOffset = new Animated.Value(PARALLAX_HEIGHT);
    this.state = { renderMap: false, renderPlaceholderOnly: true };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ renderPlaceholderOnly: false }), 200);
  }

  componentWillReceiveProps(nextProps) {
    const { receivedNotification } = this.props;
    const { receivedNotification: nextNotification } = nextProps;

    if (receivedNotification !== nextNotification)
      this.onReceiveNotification(nextNotification);
  }

  get passedProps() {
    const {
      fitnessTypeIndices,
      fitnessTypes: allFitnessTypes,
    } = this.props;
    const { session, studio, variant } = this.props.navigation.state.params;

    const { type_codes: typeCodes } = session;
    const fitnessTypes = FitnessType.filterByCodes(allFitnessTypes, fitnessTypeIndices, typeCodes);
    return { fitnessTypes, session, studio, variant };
  }
  
  // Interact booking means Reserve/Cancel
  onInteractBooking = mode => {
    const { navigation: { navigate } } = this.props;
    const { fitnessTypes, session, studio } = this.passedProps;
    navigate(SESSION_BOOKING, { fitnessTypes, mode, session, studio });
  };
  
  onNavigate = (routeName, params) => {
    const { navigation: { navigate } } = this.props;
    navigate(routeName, params);
  };

  onReceiveNotification = notification => {
    if (notification == null) return;

    const { payload, type } = notification;
    if (type !== CHECKED_IN || !(payload instanceof Session)) return;

    const { session } = this.passedProps;
    if (session.id !== payload.id) return;
    
    const { navigation: { setParams } } = this.props;
    setParams({ session: payload });
  };

  onScroll = offsetY => {
    this.transitionOffset.setValue(PARALLAX_HEIGHT - offsetY);
    this.mapBox && this.mapBox.updateScrollOffset(offsetY);
  }

  renderBackground = scrollOffset => {
    const { session: { gallery_items: items, image_link: placeholderImage } } = this.passedProps;

    return (
      <GalleryBox
        height={PARALLAX_HEIGHT}
        items={items}
        placeholderImage={placeholderImage}
        scrollOffset={scrollOffset}
      />
    );
  };

  renderContent = () => {
    const { fitnessTypes, session, studio, variant } = this.passedProps;
    const {
      amenities, description, requirements, show_up_policies: policies, pro_tips: proTips,
    } = session;
    
    const { DETAIL_SCROLL_VIEW } = WarningBoxVariants;

    const requirementsText = requirements.map(req => `- ${req}`).join('\n');
    const policiesText = policies.map(pol => `- ${pol}`).join('\n');

    return (
      <View style={styles.parallaxContent}>
        <TitleBox
          onCancel={() => this.onInteractBooking(SessionBookingModes.CANCEL)}
          reserveButton={this.renderReserveButton({ floating: false })}
          session={session}
          studio={studio}
        />
        <QuickInfoBox
          amenities={amenities}
          fitnessTypes={fitnessTypes}
          onNavigate={this.onNavigate}
          session={session}
          studio={studio}
        />
        {!_.isEmpty(proTips) && (
          <WarningBox message={proTips.join('\n')} variant={DETAIL_SCROLL_VIEW} />
        )}
        <TextInfoBox
          contents={[
            { text: description, title: I18n.t('sessionDetail.sections.description') },
          ]}
        />
        <TextInfoBox
          contents={[
            { text: requirementsText, title: I18n.t('sessionDetail.sections.requirements') },
            { text: policiesText, title: I18n.t('sessionDetail.sections.policies') },
          ]}
        />
        <MapBox ref={ref => this.mapBox = ref} scrollHeight={PARALLAX_HEIGHT} studio={studio} />
        {variant !== STUDIO_SCHEDULES && (
          <FooterBox onNavigate={this.onNavigate} studio={studio} />
        )}
      </View>
    );
  };

  renderReserveButton = ({ floating }) => {
    const {
      session: { checked_in: checkedIn, is_available: available, reservationErrors },
    } = this.passedProps;
    
    // or session is not available but no reservation errors responded
    if (!available && _.isEmpty(reservationErrors)) return null;

    return (
      <FloatingButton
        available={available}
        checkedIn={checkedIn}
        disabledMessage={reservationErrors}
        floating={floating}
        onPress={() => this.onInteractBooking(SessionBookingModes.RESERVE)}
        title={I18n.t('sessionDetail.buttons.reserve')}
        transitionOffset={this.transitionOffset}
      />
    );
  };

  render() {
    return (
      <View style={SHEETS.container}>
        <ParallaxScrollView
          containerStyle={styles.parallaxContainer}
          maskColor="transparent"
          onScroll={this.onScroll}
          onScrollEndDrag={this.onScrollEndDrag}
          renderBackground={this.renderBackground}
          touchableBackground
        >
          {this.state.renderPlaceholderOnly
            ? <LoadingPlaceholder style={styles.loadingPlaceholder} />
            : this.renderContent()
          }
        </ParallaxScrollView>
        <FadedNavigationHeader gradient transitionOffset={this.transitionOffset} />
        {this.renderReserveButton({ floating: true })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingPlaceholder: {
    width: DeviceUtils.screen.width,
  },
  parallaxContainer: {
    backgroundColor: COLORS.ALL_E,
  },
  parallaxContent: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    width: DeviceUtils.screen.width,
  },
});
