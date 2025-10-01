import { AppRegistry } from 'react-native';
import { install } from 'react-native-nitro-base64';
import { name as appName } from './app.json';
import App from './src/App';

install();
AppRegistry.registerComponent(appName, () => App);
