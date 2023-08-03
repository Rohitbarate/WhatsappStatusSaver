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
  Animated,
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
import Icon from 'react-native-vector-icons/AntDesign';

const Tab = createMaterialBottomTabNavigator();

const {ScopedStorage} = NativeModules;

const App = () => {
  const {
    requestExtPermissions,
    requestScopedPermissionAccess,
    getAccess,
    isLatestVersion,
    setIsLatestVersion,
    appOpt,
    setAppOpt,
  } = useContext(AppContext);
  // const [whatsappOpt, setWhatsappOpt] = useState(appOpt);
  const [loading, setLoading] = useState(true);
  const [showDilogue, setShowDilogue] = useState(false);

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
    const checkWT = async () => {
      const whatsappOpt = await getWT();
      console.log({whatsappOpt});
      if (whatsappOpt !== null) {
        setAppOpt(whatsappOpt);
        handlePermission();
        setLoading(false)
        // setWhatsappOpt(whatsappOpt);
      } else {
        setLoading(false);
        setShowDilogue(true);
      }
    };

    checkWT();
  }, []);

  const storeWT = async value => {
    try {
      // value :{hasAccess:boolean,folderUrl:String}
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('whatsappOpt', jsonValue);
      return;
    } catch (e) {
      console.log('error while storing Whatsapp Options : ', e);
    }
  };

  const getWT = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('whatsappOpt');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('error while getting Whatsapp Options : ', e);
    }
  };
  const setAppOptHandler = () => {
    console.log({appOpt});
    storeWT(appOpt);
    setShowDilogue(false)
    setLoading(false)
  };

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'#074e54'} barStyle={'light-content'} />
      {/* loading component */}
      {showDilogue && (
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
            backgroundColor: '#ffffff',
          }}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderWidth: 1,
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderRadius: 10,
              backgroundColor: '#075e54',
              position: 'relative',
              width: '80%',
              // height: 150,
            }}>
            <Text
              style={{
                color: '#fff',
                fontWeight: '800',
                fontSize: 18,
                alignSelf: 'flex-start',
                marginBottom: 20,
              }}>
              Choose Your App Type
            </Text>
            <View style={styles.btnView}>
              {/* animated sliding view  */}
              {/* <Animated.View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: 50,
                  borderColor: '#25D366',
                  borderWidth: 3,
                  borderRadius: 10,
                  left: 0,
                  top: appOpt.type === 'whatsapp' ? 0 : 55,
                  
                }}
              /> */}

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setAppOpt({type: 'whatsapp', isSelected: true})}
                style={[
                  styles.prmBtn,
                  {
                    borderColor: appOpt.type === 'whatsapp' && '#25D366',
                    borderWidth: appOpt.type === 'whatsapp' ? 4 : 0,
                  },
                ]}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '500',
                    fontSize: 16,
                    marginLeft: 10,
                  }}>
                  Whatsapp
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setAppOpt({type: 'whatsappB', isSelected: true})}
                style={[
                  styles.prmBtn,
                  {
                    borderColor: appOpt.type === 'whatsappB' && '#25D366',
                    marginTop: 5,
                    borderWidth: appOpt.type === 'whatsappB' ? 4 : 0,
                  },
                ]}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '500',
                    fontSize: 16,
                    marginLeft: 10,
                  }}>
                  Whatsapp Business
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-end',
                borderWidth: 1,
                borderColor: '#fff',
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 10,
                marginTop: 20,
              }}
              onPress={setAppOptHandler}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  marginRight: 5,
                  fontWeight: '500',
                }}>
                Next
              </Text>
              <Icon name="arrowright" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {loading && (
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
            {/* <Text
              style={{
                color: '#fff',
                fontWeight: '500',
                fontSize: 16,
                marginLeft: 10,
              }}>
              Checking Folder Access
            </Text> */}
          </View>
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
    // borderColor: '#fff',
    borderRadius: 10,
    // borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%',
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
    // marginTop: 10,
  },
  prmBtnText: {
    fontWeight: '800',
    fontSize: 18,
    color: '#fff',
  },
  btnView: {
    borderColor: '#ffffff90',
    borderWidth: 0.5,
    width: '100%',
    borderRadius: 10,
    // backgroundColor:'#ffffff50',
    // backfaceVisibility:'hidden'
  },
});
