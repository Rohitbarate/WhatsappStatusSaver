import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  ToastAndroid,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScopedStoragePackage from 'react-native-scoped-storage';
import {ActivityIndicator} from 'react-native-paper';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from 'react-native-splash-screen';

const Tab = createMaterialBottomTabNavigator();

// const {ScopedStorage} = NativeModules;
const {AccessStorage, ScopedStorage} = NativeModules;

const App = () => {
  const [accessLoading, setAccessLoading] = useState(false);
  const [showDilogue, setShowDialogue] = useState(false);
  // const [folderUrl, setFolderUrl] = useState(null);
  const getTabBarVisibility = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ['SelectedStatusScreen'];
    return hideOnScreens.indexOf(routeName) >= -1;
  };

  useEffect(() => {
    SplashScreen.hide();
    const getAccess = async () => {
      try {
        setAccessLoading(true);
        //  await AsyncStorage.clear()
        // get folder link stored in asyncStorage

        const folderAccess = await getData();

        // get access folder links stored in persistedUris
        const persistedUris =
          await ScopedStoragePackage.getPersistedUriPermissions();
        console.log({persistedUris});

        if (folderAccess === null && persistedUris.length === 0) {
          // user is new
          setAccessLoading(false);
          // console.log('if');
          setShowDialogue(true);
        } else {
          // console.log('else');
          if (folderAccess !== null && persistedUris.length !== 0) {
            // console.log('access');
            setAccessLoading(false);
            setShowDialogue(false);
            ToastAndroid.show(
              'Welcome back to WIStatusSaver 🙋‍♂️🙋‍♂️',
              ToastAndroid.SHORT,
            );
          } else if (folderAccess !== null && persistedUris.length === 0) {
            await AsyncStorage.clear();
            setAccessLoading(false);
            setShowDialogue(true);
          } else {
            await ScopedStoragePackage.releasePersistableUriPermission(
              persistedUris[0],
            );
            setAccessLoading(false);
            setShowDialogue(true);
          }

          // await AsyncStorage.clear();
        }
      } catch (error) {
        console.log(error);
        setAccessLoading(false);
        setShowDialogue(true);
      }
    };
    getAccess();
  }, []);

  const storeData = async value => {
    try {
      // value :{hasAccess:boolean,folderUrl:String}
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('folderAccess', jsonValue);
      return;
    } catch (e) {
      console.log('error while storing folder address : ', e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('folderAccess');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('error while getting folder address : ', e);
    }
  };

  const requestAccess = async () => {
    try {
      setAccessLoading(true);
      const res = await ScopedStorage.requestAccessToStatusesFolder();
      // console.log({mainRes: res});
      if (res !== null && res.includes('.Statuses')) {
        // user selected correct folder
        await storeData({hasAccess: true, folderUrl: res});
        setAccessLoading(false);
        ToastAndroid.show('Access Granted 🎉🎉', ToastAndroid.LONG);
        setAccessLoading(false);
        setShowDialogue(false);
      } else {
        // user selected wrong folder
        ToastAndroid.show(
          'You might select the wrong folder !',
          ToastAndroid.LONG,
        );
        // get access folder links stored in persistedUris
        const persistedUris =
          await ScopedStoragePackage.getPersistedUriPermissions();
        await ScopedStoragePackage.releasePersistableUriPermission(
          persistedUris[0],
        );
        setAccessLoading(false);
        setShowDialogue(true);
      }
      // return res;
    } catch (error) {
      console.log({error});
      const persistedUris =
        await ScopedStoragePackage.getPersistedUriPermissions();
      await ScopedStoragePackage.releasePersistableUriPermission(
        persistedUris[0],
      );
      setAccessLoading(false);
      setShowDialogue(true);
      // return null;
      ToastAndroid.show('Error !' + error, ToastAndroid.LONG);
    }
  };

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'#074e54'} barStyle={'light-content'} />
      {/* loading component */}
      {accessLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#ffffff80',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
              backgroundColor: '#075e54',
            }}>
            <ActivityIndicator color={'#fff'} size={30} />
            <Text
              style={{
                color: '#fff',
                fontWeight: '500',
                fontSize: 16,
                marginLeft: 10,
              }}>
              Checking Folder Access
            </Text>
          </View>
        </View>
      )}
      {/* Access dilogue component */}
      {showDilogue && !accessLoading && (
        <View style={{flex: 1, position: 'absolute'}}>
          <Modal animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 14,
                    fontWeight: 500,
                    textAlign: 'center',
                    textTransform: 'capitalize',
                  }}>
                  App Needs Storage Permission to download your whatsapp
                  statuses
                </Text>
                <TouchableOpacity onPress={requestAccess} style={styles.prmBtn}>
                  <Text style={styles.prmBtnText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}

      {/* <Tab.Navigator
        id="rootTab"
        initialRouteName="Home"
        activeColor="#25D366"
        inactiveColor="#fff"
        // labeled={false}
        shifting={true}
        barStyle={{backgroundColor: '#075e54', display: 'none'}}
        // screenOptions={{tabbarsty}}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={({route}) => ({
            tabBarVisible: !getTabBarVisibility(route),
            title: 'Home',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="home" color={color} size={24} />
            ),
          })}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialIcons name="settings" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator> */}
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
    backfaceVisibility: 'visible',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  prmBtn: {
    borderRadius: 5,
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  prmBtnText: {
    fontWeight: '800',
    fontSize: 18,
    color: '#fff',
  },
});
