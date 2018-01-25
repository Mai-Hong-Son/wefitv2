/**
 * @providesModule WeFit.Components.Reusables.Loadings.styles
 */

import { StyleSheet } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';

export default StyleSheet.create({
  loadingListRow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },

  loadingOverlay: {
    ...SHEETS.absoluteFlex,
    alignItems: 'center',
    backgroundColor: COLORS.BLACK_OPAQUE_HALF,
    justifyContent: 'center',
  },
  
  emptyMessage: FontUtils.build({
    align: 'center',
    color: COLORS.WEFIT,
    size: 17,

    // Extra
    marginVertical: 20,
  }),
});
