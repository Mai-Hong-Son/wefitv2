/**
 * @providesModule WeFit.Components.Reusables.PagedGallery.styles
 */

import { StyleSheet } from 'react-native';

// Constants
import { SHEETS } from 'app/constants/AppStyles';

export default StyleSheet.create({
  paginationContainer: {
    ...SHEETS.horizontalFlex,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  paginationPosition: {
    bottom: 10,
  },
});
