/**
 * @providesModule WeFit.Components.StudioDetail
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
import {
  FloatingButton, GalleryBox, HeaderRightButtons, MapBox, QuickInfoBox, TextInfoBox,
} from 'app/components/Reusables/DetailScrollView';

// Constants
import { COLORS, NAVIGATION, PARALLAX_HEIGHT, SHEETS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
import { FitnessType } from 'app/models/BaseStaticData';
import Studio from 'app/models/Studio';
import User from 'app/models/User';

// Locals
import FooterBox from './FooterBox';
import TitleBox from './TitleBox';
import withConnect from './withConnect';

@withConnect
export default class StudioDetail extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const { goBack, state: { params: { studio } } } = navigation;
    const onBack = () => goBack();

    return {
      headerLeft: <HeaderBackButton onPress={onBack} pressColorAndroid="white" tintColor="white" />,
      headerRight: <HeaderRightButtons studio={studio} />,
      headerStyle: NAVIGATION.transparentHeader,
    };
  };

  static propTypes = {
    fitnessTypeIndices: PropTypes.objectOf(PropTypes.number).isRequired,
    fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      state: PropTypes.shape({
        params: PropTypes.shape({
          studio: PropTypes.instanceOf(Studio).isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
    studioByBrandIndices: PropTypes.objectOf(
      PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))
    ).isRequired,
    studiosByCity: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(Studio))).isRequired,
    userData: PropTypes.instanceOf(User).isRequired,
  };

  constructor(props) {
    super(props);

    this.mapBox = null;
    this.transitionOffset = new Animated.Value(PARALLAX_HEIGHT);
    this.state = { renderPlaceholderOnly: true };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ renderPlaceholderOnly: false }), 200);
  }

  get passedProps() {
    const { fitnessTypeIndices: indices, fitnessTypes: types } = this.props;
    const { studio } = this.props.navigation.state.params;
    const { fitness_type_codes: codes } = studio;
    const fitnessTypes = FitnessType.filterByCodes(types, indices, codes);
    return { fitnessTypes, studio };
  }

  get sameBrandStudios() {
    const { studio: { brand_id: brandId, id: currentId } = {} } = this.passedProps;

    // Studios with `brand_id` of 0 have empty `brand_id`
    // Studios with `brand_id` of 1 are managed by WeFit brand
    if (brandId == null || brandId <= 1) return [];

    const {
      userData: { city_code: cityCode },
      studioByBrandIndices: { [cityCode]: { [brandId]: keyPaths } },
      studiosByCity,
    } = this.props;
    
    const sameBrandStudios = _.map(keyPaths, keyPath => _.get(studiosByCity, keyPath));
    const listedStudios = _.filter(sameBrandStudios, ({ id, is_enabled: enabled }) => (
      enabled && id !== currentId
    ));

    return listedStudios;
  }

  onNavigate = (routeName, params) => {
    const { navigation: { navigate } } = this.props;
    navigate(routeName, params);
  };

  // Interact booking means Reserve/Cancel
  onViewSchedules = () => {
    const { studio } = this.passedProps;
    const { navigation: { navigate } } = this.props;
    navigate(MAIN_ROUTES.STUDIO_SCHEDULES, { studio });
  };

  onScroll = offsetY => {
    this.transitionOffset.setValue(PARALLAX_HEIGHT - offsetY);
    this.mapBox && this.mapBox.updateScrollOffset(offsetY);
  }

  renderBackground = scrollOffset => {
    const { studio } = this.passedProps;
    const { gallery_items: items, image_link: placeholderImage } = studio || {};

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
    const { fitnessTypes, studio } = this.passedProps;
    const { description, pro_tips: proTips } = studio;
    const { sameBrandStudios } = this;

    const { DETAIL_SCROLL_VIEW } = WarningBoxVariants;

    const schedulesButton = this.renderSchedulesButton({ floating: false });

    return (
      <View style={styles.parallaxContent}>
        <TitleBox schedulesButton={schedulesButton} studio={studio} />
        <QuickInfoBox fitnessTypes={fitnessTypes} onNavigate={this.onNavigate} studio={studio} />
        {!_.isEmpty(proTips) && (
          <WarningBox message={proTips.join('\n')} variant={DETAIL_SCROLL_VIEW} />
        )}
        {!_.isEmpty(description) && (
          <TextInfoBox
            contents={[
              { text: description, title: I18n.t('studioDetail.sections.description') },
            ]}
          />
        )}
        <MapBox ref={ref => this.mapBox = ref} scrollHeight={PARALLAX_HEIGHT} studio={studio} />
        {!_.isEmpty(sameBrandStudios) && (
          <FooterBox onNavigate={this.onNavigate} sameBrandStudios={sameBrandStudios} />
        )}
      </View>
    );
  };

  renderSchedulesButton = ({ floating }) => (
    <FloatingButton
      floating={floating}
      onPress={this.onViewSchedules}
      title={I18n.t('studioDetail.buttons.viewSchedules')}
      transitionOffset={this.transitionOffset}
    />
  );

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
        {this.renderSchedulesButton({ floating: true })}
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
