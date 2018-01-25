/**
 * @providesModule WeFit.Components.Reusables.FitnessTypeIcon.styles
 */

import { StyleSheet } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  textIcon: FontUtils.build({
    align: 'center',
    color: 'white',
    size: 16,
    weight: 'bold',

    // Extra
    marginBottom: 1,
  }),
});
