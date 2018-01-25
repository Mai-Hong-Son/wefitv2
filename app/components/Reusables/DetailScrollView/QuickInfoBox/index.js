/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.QuickInfoBox
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, View } from 'react-native';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import FitnessTypeIcon, {
  variants as FitnessTypeIconVariants,
} from 'app/components/Reusables/FitnessTypeIcon';
import Tooltips from 'app/components/Reusables/Tooltips';

// Constants
import { COLORS } from 'app/constants/AppStyles';
import { MAIN_ROUTES } from 'app/constants/RouteNames';

// Models
import { FitnessType } from 'app/models/BaseStaticData';
import DisplayAmenity from 'app/models/DisplayAmenity';
import Session from 'app/models/Session';
import Studio from 'app/models/Studio';

// Utils
import { formatText } from 'app/utils';

// Locals
import { AMENITY_ICONS, ITEMS_PER_ROW, LEVEL_ICONS } from './constants';
import QuickInfoItem from './QuickInfoItem';
import RatingInfoItem from './RatingInfoItem';

const { DETAIL_SCROLL_VIEW } = FitnessTypeIconVariants;

export default class QuickInfoBox extends React.PureComponent {
  static propTypes = {
    amenities: PropTypes.arrayOf(PropTypes.instanceOf(DisplayAmenity)),
    fitnessTypes: PropTypes.arrayOf(PropTypes.instanceOf(FitnessType)).isRequired,
    onNavigate: PropTypes.func.isRequired,
    session: PropTypes.instanceOf(Session),
    studio: PropTypes.instanceOf(Studio),
  };
  
  static defaultProps = {
    amenities: null,
    session: null,
    studio: null,
  };

  constructor(props) {
    super(props);

    this.onNavigate = this.props.onNavigate.bind(this);
    
    const { advanced, basic, everyone, intermediate } = I18n.t('detailScrollView.quickInfo.levels');
    this.levelsOrder = [everyone, basic, intermediate, advanced];

    this.amenityNodes = {};
    this.currentSessionNode = null;
    this.tooltips = null;
  }

  onPressAmenity = ({ code, displayName }) => {
    const { amenities: template } = I18n.t('detailScrollView.quickInfo.tooltips');
    const message = formatText(template, displayName);
    this.tooltips.showForNode(this.amenityNodes[code], message);
  };
  
  onPressCurrentSession = currentSessionOrder => {
    const { currentSession: template } = I18n.t('detailScrollView.quickInfo.tooltips');
    const message = formatText(template, currentSessionOrder);
    this.tooltips.showForNode(this.currentSessionNode, message);
  };
  
  onPressRating = () => {
    const { session, studio } = this.props;
    this.onNavigate(MAIN_ROUTES.REVIEWS_DETAIL, { session, studio });
  };

  buildItems = () => {
    const { amenities, fitnessTypes, session, studio } = this.props;

    if (studio == null) return [];

    const actualItems = session != null && amenities != null
      ? this.buildSessionDetailItems({ amenities, fitnessTypes, session })
      : this.buildStudioDetailItems({ fitnessTypes, studio });

    // Padding space flexible items
    const numOfItemsToPad = (ITEMS_PER_ROW - actualItems.length % ITEMS_PER_ROW) % ITEMS_PER_ROW;
    const paddingItems = _.map(_.range(numOfItemsToPad), idx => (
      <QuickInfoItem key={`flex_space_${idx}`} />
    ));
    
    const items = _.compact(_.concat(actualItems, paddingItems));
    const rowsCount = items.length / ITEMS_PER_ROW;

    return { items, rowsCount };
  }

  buildAmenityItem = amenity => {
    const { code, displayName } = amenity;
    const { [code]: iconSource } = AMENITY_ICONS;

    return (
      <QuickInfoItem
        borderless={iconSource != null}
        icon={iconSource == null ? undefined : <Image source={iconSource} />}
        key={`amenity_item_${code}`}
        onNodeRef={ref => this.amenityNodes[code] = ref}
        onPress={() => this.onPressAmenity(amenity)}
        title={displayName}
      />
    );
  };

  buildFitnessTypeItems = ({ fitnessTypes, session, studio }) => {
    if (_.isEmpty(fitnessTypes) || (session == null && studio == null)) return [];

    if (session != null) {
      const { name } = fitnessTypes[0];
      const icon = <FitnessTypeIcon types={fitnessTypes} variant={DETAIL_SCROLL_VIEW} />;
      return [<QuickInfoItem borderless icon={icon} key="fitness_type_item" title={name} />];
    }
    
    return _.map(fitnessTypes, (fitnessType, idx) => {
      const icon = <FitnessTypeIcon types={[fitnessType]} variant={DETAIL_SCROLL_VIEW} />;
      return (
        <QuickInfoItem
          borderless
          icon={icon}
          key={`fitness_type_item_${idx}`}
          title={fitnessType.name}
        />
      );
    });
  };

  buildLevelItem = level => {
    const levelIndex = _.indexOf(this.levelsOrder, level);
    const iconSource = LEVEL_ICONS[levelIndex];
    
    return (
      <QuickInfoItem
        icon={iconSource == null ? undefined : <Image source={iconSource} />}
        key="level_item"
        title={level}
      />
    );
  };

  buildRatingItem = ({ count, score }) => {
    const onPressHandler = count > 0 ? this.onPressRating : undefined;

    return (
      <RatingInfoItem
        count={count}
        key="rating_item"
        onPress={onPressHandler}
        score={score}
      />
    );
  };

  buildSessionDetailItems = ({ amenities, fitnessTypes, session }) => {
    const {
      currentSessionOrder,
      instructor_name: instructor,
      level,
      ratingStatus: { count, score },
    } = session;
    const { currentSession, instructor: template } = I18n.t('detailScrollView.quickInfo');
    
    const currentOrderItem = currentSessionOrder != null && (
      <QuickInfoItem
        iconText={currentSessionOrder}
        key="current_order_item"
        onNodeRef={ref => this.currentSessionNode = ref}
        onPress={() => this.onPressCurrentSession(currentSessionOrder)}
        title={currentSession}
      />
    );

    const instructorItem = instructor && (
      <QuickInfoItem
        icon={<Image source={require('app/assets/quick-info-icons/instructor.png')} />}
        key="instructor_item"
        title={formatText(template, instructor)}
      />
    );
    
    return _.compact([
      ...this.buildFitnessTypeItems({ fitnessTypes, session }),
      this.buildRatingItem({ count, score }),
      instructorItem,
      currentOrderItem,
      this.buildLevelItem(level),
      ..._.map(amenities, this.buildAmenityItem),
    ]);
  };
  
  buildStudioDetailItems = ({ fitnessTypes, studio }) => {
    const { ratingStatus: { count, score } } = studio;

    return _.compact([
      ...this.buildFitnessTypeItems({ fitnessTypes, studio }),
      this.buildRatingItem({ count, score }),
    ]);
  };

  render() {
    const { items, rowsCount } = this.buildItems();

    return (
      <View style={styles.container}>
        {_.map(_.range(rowsCount), index => (
          <View key={`items_row_${index}`} style={styles.itemsRow}>
            {_.slice(items, index * ITEMS_PER_ROW, (index + 1) * ITEMS_PER_ROW)}
          </View>
        ))}
        <Tooltips ref={ref => this.tooltips = ref} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ALL_C,
    paddingBottom: 10,
    paddingTop: 30,
  },
  itemsRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});
