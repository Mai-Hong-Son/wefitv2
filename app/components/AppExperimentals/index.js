/**
 * @providesModule WeFit.Components.AppExperimentals
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontUtils } from '@onaclover/react-native-utils';
import moment from 'moment';
import qs from 'qs';
import urlParse from 'url-parse';
import _ from 'lodash';

// Constants
import { COLORS, SHEETS } from 'app/constants/AppStyles';
import { FEATURES } from 'app/constants/Flags';

// Utils
import * as Utils from 'app/utils';

// Locals
import withConnect from './withConnect';

/* eslint-disable no-console */
console.ignoredYellowBox = ['Setting a timer'];
/* eslint-enable no-console */

if (FEATURES.GLOBAL_MODULES) {
  Object.assign(global, { Utils, moment, qs, urlParse, _ });
}

function ExpPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{'Experimentals go here'}</Text>
    </View>
  );
}

@withConnect
export default class AppExperimentals extends React.PureComponent {
  constructor(props) {
    super(props);
    global.AppExp = this;
  }
  
  render() {
    return <ExpPlaceholder />;
  }
}

const styles = StyleSheet.create({
  container: {
    ...SHEETS.container,
    paddingTop: 20,
  },
  text: FontUtils.build({
    color: COLORS.WEFIT,
    size: 30,
    weight: 'bold',
  }),
});
