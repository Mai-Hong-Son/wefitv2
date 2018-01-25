/**
 * @providesModule WeFit.Components.DoubleSlider.styles
 */

import { StyleSheet } from 'react-native';

// Constants
import { COLORS } from 'app/constants/AppStyles';

/* eslint-disable no-underscore-dangle */

export default StyleSheet.create({
  horizontalFlex: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  slideBar: {
    backgroundColor: COLORS.ALL_9,
    borderRadius: 3,
    height: 6,
    flex: 1,
  },
  slideBarDisabled: {
    backgroundColor: COLORS.ALL_9,
  },
  leftBar: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  rightBar: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  highlightBar: {
    backgroundColor: COLORS.PINK,
    borderRadius: 0,
  },

  track: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
  },
  trackDisabled: {
    backgroundColor: COLORS.ALL_9,
  },

  disabledMask: {
    backgroundColor: 'transparent',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
