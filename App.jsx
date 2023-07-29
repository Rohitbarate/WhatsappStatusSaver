import {
  StyleSheet,
  Text,
  View,
  NativeModules,
  ToastAndroid,
  TouchableOpacity,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
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
import {AppContext} from './src/context/appContext';

const Tab = createMaterialBottomTabNavigator();

const {ScopedStorage} = NativeModules;

const App = () => {
  const {
    requestExtPermissions,
    requestScopedPermissionAccess,
    getAccess,
    isLatestVersion,
    setIsLatestVersion,
  } = useContext(AppContext);

  // const getTabBarVisibility = route => {
  //   const routeName = getFocusedRouteNameFromRoute(route);
  //   const hideOnScreens = ['SelectedStatusScreen'];
  //   return hideOnScreens.indexOf(routeName) >= -1;
  // };

  useEffect(() => {
    SplashScreen.hide();
    const appV = Platform.Version;
    // const appV = 28
    // check app version
    console.log({appV});
    const handlePermission = async () => {
      //  app-V less than android 10
      if (appV < 29) {
        setIsLatestVersion(false);
        await requestExtPermissions();
      } else {
        setIsLatestVersion(true);
        await getAccess();
        // if (!r) {
        //   await requestScopedPermissionAccess();
        // }
      }
    };
    handlePermission();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'#074e54'} barStyle={'light-content'} />
      {/* loading component */}
      {/* {accessLoading && (
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
      )} */}
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
