/**
 * @providesModule WeFit.Components.Home.Cards.SessionCard
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';
import Button from 'react-native-button';
import I18n from 'react-native-i18n';
import _ from 'lodash';

// Components
import { SessionContentBox } from 'app/components/Reusables/DetailScrollView';
import RatingStars from 'app/components/Reusables/RatingStars';
import ReservationCodeBox from 'app/components/Reusables/ReservationCodeBox';

// Constants
import { SHEETS } from 'app/constants/AppStyles';
import { FEATURES } from 'app/constants/Flags';
import { FEED_TYPES } from 'redux/constants';

// Models
import SessionFeed from 'app/models/Feeds/SessionFeed';
import Studio from 'app/models/Studio';

// Locals
import SessionReviewPopup from '../SessionReviewPopup';
import ShadowCard from '../ShadowCard';
import withConnect from './withConnect';

const { SESSION_OCCURRING, SESSION_REVIEW, SESSION_UPCOMING } = FEED_TYPES;

@withConnect
export default class SessionCard extends React.PureComponent {
  static propTypes = {
    cancelReview: PropTypes.func.isRequired,
    data: PropTypes.instanceOf(SessionFeed).isRequired,
    language: PropTypes.string.isRequired,
    onDismiss: PropTypes.func,
    onProcess: PropTypes.func,
    studioIndices: PropTypes.objectOf(PropTypes.string).isRequired,
    studiosByCity: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.instanceOf(Studio))).isRequired,
  };

  static defaultProps = {
    onDismiss: null,
    onProcess: null,
  };

  constructor(props) {
    super(props);
    this.cancelReview = this.props.cancelReview.bind(this);
  }

  get cardTitle() {
    const { data: { type } } = this.props;
    const { occurring, review, upcoming } = I18n.t('home.cards.session');

    switch (type) {
      case SESSION_OCCURRING: return occurring;
      case SESSION_REVIEW: return review;
      case SESSION_UPCOMING: return upcoming;
      default: return undefined;
    }
  }

  get processText() {
    const { data: { session: { reservationCode }, type } } = this.props;
    if (type !== SESSION_UPCOMING) return undefined;

    return _.isEmpty(reservationCode) ? I18n.t('home.cards.session.viewDetail') : undefined;
  }

  dismiss = shouldCancel => {
    const { data, onDismiss } = this.props;
    const { review_id: reviewId, type } = data;

    if (type !== SESSION_REVIEW) return;
    if (shouldCancel) this.cancelReview(reviewId);
    onDismiss && onDismiss.bind(this)(data);
  };

  renderCameraButton = () => {
    if (!FEATURES.SESSION_STORY) return null;
    
    const { data: { type } } = this.props;
    if (type !== SESSION_OCCURRING) return null;

    return (
      <View style={styles.cameraContainer}>
        <Button>
          <Image source={require('app/assets/buttons/camera.png')} />
        </Button>
      </View>
    );
  };

  renderRatingStars = () => {
    const { data: { type } } = this.props;
    if (type !== SESSION_REVIEW) return null;
    
    return (
      <View style={styles.starsContainer}>
        <RatingStars
          onSelect={ratingScore => this.sessionReviewPopup.showWithScore(ratingScore)}
          width={190}
        />
      </View>
    );
  };

  renderReservationCode = () => {
    const { data: { session, type } } = this.props;
    if (type !== SESSION_UPCOMING) return null;

    const { reservationCode } = session;
    return <ReservationCodeBox code={reservationCode} />;
  };

  render() {
    const { data, onProcess, studioIndices: indices, studiosByCity: studios } = this.props;
    const { session, type } = data;
    
    const { studio_id: studioId } = session;
    const studio = Studio.findById(studios, indices, studioId);

    return (
      <ShadowCard
        canDismiss={type === SESSION_REVIEW}
        onDismiss={() => this.dismiss(true)}
        onProcess={() => onProcess && onProcess(data)}
        processText={this.processText}
        title={this.cardTitle}
        touchable={type === SESSION_UPCOMING}
      >
        <SessionContentBox session={session} studio={studio} />
        {this.renderCameraButton()}
        {this.renderRatingStars()}
        {this.renderReservationCode()}
        <SessionReviewPopup
          data={data}
          onRef={ref => this.sessionReviewPopup = ref}
          onSuccess={() => this.dismiss(false)}
        />
      </ShadowCard>
    );
  }
}

const styles = StyleSheet.create({
  cameraContainer: {
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    top: 0,
  },
  starsContainer: {
    ...SHEETS.stretched,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingTop: 20,
  },
});
