/**
 * @providesModule WeFit.Components.Home.Cards.SessionReviewPopup
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import I18n from 'react-native-i18n';
import { FontUtils } from '@onaclover/react-native-utils';
import _ from 'lodash';

// Components
import { TextButton } from 'app/components/Reusables/Buttons';
import KeyboardAvoidPopup from 'app/components/Reusables/KeyboardAvoidPopup';
import RatingStars from 'app/components/Reusables/RatingStars';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { GLOBAL_ALERT_TYPES } from 'redux/constants';

// Models
import SessionFeed from 'app/models/Feeds/SessionFeed';

// Locals
import withConnect from './withConnect';

@withConnect
export default class SessionReviewPopup extends React.PureComponent {
  static propTypes = {
    data: PropTypes.instanceOf(SessionFeed).isRequired,
    onRef: PropTypes.func,
    onSuccess: PropTypes.func.isRequired,
    reviewSubmission: PropTypes.shape({
      error: PropTypes.object,
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    showGlobalAlert: PropTypes.func.isRequired,
    submitReview: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onRef: null,
  };

  constructor(props) {
    super(props);

    const { onRef, showGlobalAlert, submitReview } = this.props;
    onRef && onRef.bind(this)(this);
    this.showGlobalAlert = showGlobalAlert.bind(this);
    this.submitReview = submitReview.bind(this);

    this.state = { content: null, ratingScore: 0 };
  }

  componentWillReceiveProps(nextProps) {
    const { reviewSubmission } = this.props;
    const { reviewSubmission: nextReviewSubmission } = nextProps;

    if (reviewSubmission !== nextReviewSubmission) {
      const { error, loading } = nextReviewSubmission;
      if (!loading && error == null) this.onSuccess();
    }
  }

  onSuccess = () => {
    this.popupContainer.dismiss();
    const { onSuccess } = this.props;
    onSuccess.bind(this)();
    
    this.setState({ content: null, ratingScore: 0 });
    const { reviewSuccess: message } = I18n.t('home.cards.session');
    const { submitReview: title } = I18n.t('globalAlert');
    this.showGlobalAlert({ message, title, type: GLOBAL_ALERT_TYPES.SUCCESS });
  };

  showWithScore = (ratingScore = 0) => {
    this.setState({ ratingScore }, () => this.popupContainer.show());
  }

  onSubmitReview = () => {
    const { data: { review_id: reviewId } } = this.props;
    const { ratingScore, content: rawContent } = this.state;
    const content = _.trim(rawContent);
    this.submitReview({ content, ratingScore, reviewId });
  };

  render() {
    const { data: { session: { name } } } = this.props;
    const { content, ratingScore } = this.state;
    const { buttons: { cancel, submit }, placeholder, presets } = I18n.t('home.sessionReviewPopup');

    return (
      <KeyboardAvoidPopup
        backgroundColor={COLORS.BLACK_OPAQUE_HALF}
        ref={ref => this.popupContainer = ref}
      >
        <View style={styles.container}>
          <Text style={styles.name}>{name}</Text>
          <RatingStars
            onSelect={ratingScore => this.setState({ ratingScore })}
            score={ratingScore}
            style={styles.ratingStars}
            width={190}
          />
          {ratingScore > 0 && (
            <Text style={styles.presetReview}>{`"${presets[ratingScore - 1]}"`}</Text>
          )}
          <View style={styles.contentInputContainer}>
            <TextInput
              autoCapitalize="sentences"
              autoFocus
              blurOnSubmit={false}
              multiline
              onChangeText={text => this.setState({ content: text })}
              placeholder={placeholder}
              placeholderTextColor={COLORS.ALL_9}
              style={styles.contentInput}
              textAlignVertical="top"
              underlineColorAndroid="transparent"
              value={content}
            />
          </View>
          <View style={SHEETS.horizontalFlex}>
            <TextButton
              background={COLORS.ALL_E}
              containerStyle={styles.buttonLeft}
              flexSize
              onPress={() => this.popupContainer.dismiss()}
              title={cancel}
              titleColor={COLORS.WEFIT}
              underlineColorAndroid="transparent"
            />
            <TextButton
              disabled={ratingScore === 0}
              flexSize
              onPress={this.onSubmitReview}
              title={submit}
            />
          </View>
        </View>
      </KeyboardAvoidPopup>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: 328,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 25,
  },
  name: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 17,
    weight: 'semibold',

    // Extra
    height: 26,
    marginBottom: 20,
  }),
  ratingStars: {
    height: 30,
    marginBottom: 20,
  },
  presetReview: FontUtils.build({
    align: 'center',
    color: COLORS.TRIPLE_6E,
    size: 14,
    style: 'italic',

    // Extra
    height: 19,
    marginBottom: 20,
  }),
  buttonLeft: {
    marginRight: 13,
  },

  contentInputContainer: {
    ...SHEETS.stretched,
    borderColor: COLORS.ALL_9,
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  contentInput: FontUtils.build({
    color: COLORS.WEFIT,
    size: 17,

    // Extra
    alignSelf: 'stretch',
    flex: 1,
  }),
});
