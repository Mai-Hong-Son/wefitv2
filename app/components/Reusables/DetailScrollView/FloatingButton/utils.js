/**
 * @providesModule WeFit.Components.Reusables.DetailScrollView.FloatingButton.utils
 */

// Constants
import { HEADER_HEIGHT } from 'app/constants/AppStyles';

/**
 * Preset floating button height & margin to calculate animation values
 */
export const HEIGHT = 44;
export const MARGIN = 16;

/**
 * Position to snap floating button to FadedNavigationHeader's bottom
 */
const EPOCH = 0.01;
const SNAP_POINT = -HEIGHT + MARGIN + EPOCH;

// Input range for scroll directions: [up, up, down, down]
const INPUT_RANGE = [
  SNAP_POINT - HEIGHT - EPOCH,
  SNAP_POINT - HEIGHT,
  SNAP_POINT,
  SNAP_POINT + EPOCH,
];

/**
 * Floating button animations include 2 components: outer & inner button:
 *  - Outer button is wrapped in an Animated.View, absolute positioned outside scrollview
 *  - Inner button is placed normally inside scrollview's content
 * 
 * Animation process:
 *  - When scrolling to `SNAP_POINT`, inner button is hidden
 *    (EPOCH ~ 0.01 distance means it will be instant)
 *  - Outer button is visible, slided up & scaled to fit screen's width, snap to navigation's header
 */
export function buildAnimationStyles({ available, floating, transitionOffset }) {
  // Not floating = inner button
  if (!floating)
    return {
      opacity: transitionOffset.interpolate({
        inputRange: [SNAP_POINT - EPOCH, SNAP_POINT],
        outputRange: [0, 1],
      }),
    };

  // Outer button
  const margin = transitionOffset.interpolate({
    inputRange: INPUT_RANGE,
    outputRange: [0, 0, available ? 16 : 0, available ? 16 : 0],
  });

  const opacity = transitionOffset.interpolate({
    inputRange: INPUT_RANGE,
    outputRange: [1, 1, 1, 0],
  });

  const top = transitionOffset.interpolate({
    inputRange: INPUT_RANGE,
    outputRange: [HEADER_HEIGHT, HEADER_HEIGHT, HEADER_HEIGHT + MARGIN, 0],
  });

  const borderRadius = transitionOffset.interpolate({
    inputRange: INPUT_RANGE,
    outputRange: [0, 0, available ? 4 : 0, available ? 4 : 0],
  });

  return {
    borderRadius,
    opacity,
    top,
    left: margin,
    position: 'absolute',
    right: margin,
  };
}
