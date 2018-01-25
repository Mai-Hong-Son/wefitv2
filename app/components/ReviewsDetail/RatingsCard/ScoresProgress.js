/**
 * @providesModule WeFit.Components.ReviewsDetail.RatingsCard.ScoresProgress
 */

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Bar as BarProgress } from 'react-native-progress';
import _ from 'lodash';

// Components
import RatingStars from 'app/components/Reusables/RatingStars';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

const STAR_SIZE = 6;

export default class ScoresProgress extends React.PureComponent {
  static propTypes = {
    scores: PropTypes.shape({
      1: PropTypes.number.isRequired,
      2: PropTypes.number.isRequired,
      3: PropTypes.number.isRequired,
      4: PropTypes.number.isRequired,
      5: PropTypes.number.isRequired,
    }).isRequired,
    total: PropTypes.number.isRequired,
  };

  state = { loading: true };

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 200);
  }

  renderStarRow = starsCount => {
    const { scores, total } = this.props;
    const { loading } = this.state;

    const { [starsCount]: count } = scores;
    const width = starsCount * STAR_SIZE + (starsCount - 1) * STAR_SIZE / 2;

    return (
      <View key={`progress_item_${starsCount}`} style={SHEETS.horizontalFlex}>
        <RatingStars
          max={starsCount}
          score={starsCount}
          size={STAR_SIZE}
          style={styles.ratingStars}
          width={width}
        />
        <BarProgress
          borderRadius={0}
          borderWidth={0}
          color="white"
          indeterminate={loading}
          progress={count / total}
          unfilledColor="rgba(255, 255, 255, 0.2)"
          width={110}
        />
      </View>
    );
  };

  render() {
    const starRows = _.reverse(_.range(1, 6));

    return (
      <View style={styles.container}>
        {_.map(starRows, this.renderStarRow)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  ratingStars: {
    marginRight: 10,
  },
});
