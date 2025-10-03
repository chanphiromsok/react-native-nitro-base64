import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';
import { install } from 'react-native-nitro-base64';

install();
AppRegistry.registerComponent(appName, () => App);
