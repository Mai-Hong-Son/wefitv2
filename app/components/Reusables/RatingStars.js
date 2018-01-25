/**
 * @providesModule WeFit.Components.Reusables.RatingStars
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import StarRating from 'react-native-star-rating';

// Constants
import { COLORS } from 'app/constants/AppStyles';

export default function RatingStars({ color, max, onSelect, score, size, style, width }) {
  const stars = (
    <StarRating
      disabled={onSelect == null}
      emptyStarColor={color}
      maxStars={max}
      rating={score}
      selectedStar={rating => onSelect && onSelect(rating)}
      starColor={color}
      starSize={size}
    />
  );

  if (style == null && width == null) return stars;

  return (
    <View style={[{ width }, style]}>
      {stars}
    </View>
  );
}

RatingStars.propTypes = {
  color: PropTypes.string,
  max: PropTypes.number,
  onSelect: PropTypes.func,
  score: PropTypes.number,
  size: PropTypes.number,
  style: ViewPropTypes.style,
  width: PropTypes.number,
};

RatingStars.defaultProps = {
  color: COLORS.STARS,
  max: 5,
  onSelect: null,
  score: 0,
  size: 30,
  style: null,
  width: null,
};
