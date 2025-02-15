/**
 * @format
 */

import '@azure/core-asynciterator-polyfill';
import 'react-native-get-random-values';
import {AppRegistry} from 'react-native';
import {AppWrapper} from './source/AppWrapper';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppWrapper);
