/**
 * WeFit Android entry point
 * @providesModule WeFit.Entry.Android
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './app';

const WeFit = () => <App />;
AppRegistry.registerComponent('WeFit', () => WeFit);
