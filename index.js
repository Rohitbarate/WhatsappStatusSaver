/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AppWraper from './AppWraper';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    // notification.finish(PushNotification.FetchResult.NoData);
  },

  popInitialNotification: true,

  requestPermissions: false,
});

PushNotification.createChannel({
  channelId: 'wiStatusSaver.rohitbarate',
  channelName: 'The perfect code', 
  importance: 4,
  vibrate: true,
});

AppRegistry.registerComponent(appName, () => AppWraper);
