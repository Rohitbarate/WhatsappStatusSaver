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
  ActivityIndicator,
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
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from 'react-native-splash-screen';
import {
  AppOpenAd,
  TestIds,
  AdEventType,
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';
import {AppContext} from './src/context/appContext';
import Icon from 'react-native-vector-icons/AntDesign';
import {RNLauncherKitHelper} from 'react-native-launcher-kit';

const Tab = createMaterialBottomTabNavigator();

const {ScopedStorage} = NativeModules;

const App = () => {
  const {
    requestExtPermissions,
    getAccess,
    setIsLatestVersion,
    requestScopedPermissionAccess,
    isLatestVersion,
    appOpt,
    setAppOpt,
    showAppTypeDilogue,
    setShowAppTypeDilogue,
    changeAppOptHandler,
    getWT,
    storeWT,
    setStatuses,
  } = useContext(AppContext);
  const [tempAppType, setTempAppType] = useState(appOpt.type);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [showBannerAd, setShowBannerAd] = useState(false);

  const appOpenAdId = __DEV__
    ? TestIds.APP_OPEN
    : 'ca-app-pub-9923230267052642/3218301764';

  const bannerAdId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-9923230267052642/1145057793';

  const appOpenAd = AppOpenAd.createForAdRequest(appOpenAdId, {
    requestNonPersonalizedAdsOnly: true,
    // keywords: ['fashion', 'clothing'],
  });

  useEffect(() => {
    SplashScreen.hide();
    appOpenAd.load();
    const appV = Platform.Version;
    // const appV = 28

    appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
      appOpenAd.show();
      setShowBannerAd(true);
    });

    // check app version
    console.log({appV});
    const handlePermission = async () => {
      //  app-V less than android 10
      if (appV < 29) {
        setIsLatestVersion(false);
        await requestExtPermissions();
      } else {
        console.log('handlePermission called');
        setIsLatestVersion(true);
        await getAccess();
        // if (!r) {
        //   await requestScopedPermissionAccess();
        // }
      }
    };
    const checkWT = async () => {
      // await AsyncStorage.removeItem('whatsappOpt')
      setLoading(true);
      const whatsappOpt = await getWT();
      console.log({whatsappOpt});
      if (whatsappOpt !== null) {
        setAppOpt(whatsappOpt);
        handlePermission();
        setLoading(false);
        // setWhatsappOpt(whatsappOpt);
      } else {
        setLoading(false);
        setShowAppTypeDilogue(true);
      }
    };

    checkWT();
  }, []);

  const setAppOptHandler = async () => {
    setFilterLoading(true);
    console.log({appOpt: appOpt.type, filterOption_type: tempAppType});
    const result = await changeAppOptHandler(tempAppType);
    if (result) {
      setFilterLoading(false);
      console.log('going in if');
      await AsyncStorage.removeItem('folderAccess');
      const persistedUris =
        await ScopedStoragePackage.getPersistedUriPermissions();
      console.log({persistedUris});
      if (persistedUris.length >= 1) {
        await ScopedStoragePackage.releasePersistableUriPermission(
          persistedUris[0],
        );
      }
      storeWT({isSelected: true, type: tempAppType});
      // navigation.jumpTo('Whatsapp');
      setStatuses({
        allStatuses: [],
        currentMedia: '',
        mediaName: '',
      });
      setFilterLoading(false);
      setShowAppTypeDilogue(false);
      setLoading(false);
      getAccess();
    } else {
      setFilterLoading(false);
    }
  };

  // const changeAppOptHandler = async (apptype) => {
  //   const result = await RNLauncherKitHelper.checkIfPackageInstalled(
  //    apptype ==="whatsapp"? 'com.whatsapp':"com.whatsapp.w4b"
  //   );
  //   console.log({result});
  // };

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'#074e54'} barStyle={'light-content'} />
      {/* loading component */}
      {showAppTypeDilogue && (
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
                onPress={() => setTempAppType('whatsapp')}
                style={[
                  styles.prmBtn,
                  {
                    borderColor: tempAppType === 'whatsapp' && '#25D366',
                    borderWidth: tempAppType === 'whatsapp' ? 4 : 0,
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
                onPress={() => setTempAppType('whatsappB')}
                style={[
                  styles.prmBtn,
                  {
                    borderColor: tempAppType === 'whatsappB' && '#25D366',
                    marginTop: 5,
                    borderWidth: tempAppType === 'whatsappB' ? 4 : 0,
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
            {filterLoading ? (
              <View style={{alignSelf: 'flex-end', marginTop: 20}}>
                <ActivityIndicator color={'#fff'} size={30} />
              </View>
            ) : (
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
                activeOpacity={0.5}
                onPress={() => setAppOptHandler()}>
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
            )}
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
      {showBannerAd && (
        <View style={{backgroundColor:'#fff'}}>
          <BannerAd
            unitId={bannerAdId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      )}
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
