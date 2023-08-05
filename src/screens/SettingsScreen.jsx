import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/Ionicons';
import {AppContext} from '../context/appContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScopedStoragePackage from 'react-native-scoped-storage';

const SettingsScreen = ({navigation}) => {
  const {
    appOpt,
    setAppOpt,
    requestExtPermissions,
    getAccess,
    setIsLatestVersion,
    setStatuses,
    changeAppOptHandler,
    getWT,
    storeWT,
  } = useContext(AppContext);
  // const [appOpt.type, setwhatsappType] = useState('whatsapp'); // options 1.whatsapp 2. whatsappB
  const [isModelVisible, setIsModelVisible] = useState(false);
  const [modelfor, setModelfor] = useState(null); // 'appType' & 'appTheme'
  const [appTheme, setAppTheme] = useState('Light'); // Light || Dark || System
  const [filterLoading, setFilterLoading] = useState(false);

  // useEffect(() => {
  //   var appV = Platform.Version;
  // },[])

  const checkWT = async () => {
    // setLoading(true);

    const whatsappOpt = await getWT();
    console.log({whatsappOpt});
    if (whatsappOpt !== null) {
      setAppOpt(whatsappOpt);
      handlePermission();
      // setLoading(false);
      // setWhatsappOpt(whatsappOpt);
    } else {
      // setLoading(false);
      // setShowDilogue(true);
    }
  };
  // checkWT();
  // }, []);

  const handleThemeFilter = filterOption => {
    setAppTheme(filterOption);
    setIsModelVisible(false);
  };

  const setAppOptHandler = async filterOption => {
    // console.log({appOpt: appOpt.type, filterOption_type: filterOption});
   try {
    const result = await changeAppOptHandler(filterOption);
    if (filterOption !== appOpt.type && result) {
      setFilterLoading(false);
      console.log('going in if');
      await AsyncStorage.removeItem('folderAccess');
      const persistedUris =
        await ScopedStoragePackage.getPersistedUriPermissions();
      await ScopedStoragePackage.releasePersistableUriPermission(
        persistedUris[0],
      );
      storeWT({...appOpt, type: filterOption});
      navigation.jumpTo('Whatsapp');
      setStatuses({
        allStatuses: [],
        currentMedia: '',
        mediaName: '',
      });
    }
    setFilterLoading(false);
    setIsModelVisible(false);
   } catch (error) {
    console.log({error});
    setFilterLoading(false);
    setIsModelVisible(false);
   }
  };

 

  const handlePermission = async () => {
    const appV = Platform.Version;
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

  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        paddingVertical: 16,
        alignItems: 'center',
      }}>
      {/* app type */}
      <TouchableOpacity
        style={styles.optContDiv}
        onPress={() => {
          setIsModelVisible(true);
          setModelfor('appType');
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon3 color={'#000'} size={30} name={'options-outline'} />
          <View style={styles.optCont}>
            <Text style={{color: '#000', fontSize: 16, fontWeight: '600'}}>
              whatsapp Type
            </Text>
            <Text style={{color: '#25c795', fontSize: 12}}>
              {appOpt.type === 'whatsappB'
                ? 'whatsapp business'
                : 'whatsapp (Default)'}
            </Text>
          </View>
        </View>
        <Icon color={'#000'} size={20} name={'arrow-forward-ios'} />
      </TouchableOpacity>
      {/* app theme */}
      <TouchableOpacity
        style={[styles.optContDiv]}
        onPress={() => {
          Alert.alert('', 'Feature will coming soon, Stay tune');
          // setIsModelVisible(true);
          // setModelfor('appTheme');
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon3 color={'#000'} size={30} name={'color-palette'} />
          <View style={styles.optCont}>
            <Text style={{color: '#000', fontSize: 16, fontWeight: '600'}}>
              Theme
            </Text>
            <Text style={{color: '#25c795', fontSize: 12}}>
              {appTheme == 'System' ? 'System default' : appTheme}
            </Text>
          </View>
        </View>
        <Icon color={'#000'} size={20} name={'arrow-forward-ios'} />
      </TouchableOpacity>

      {/* {isModelVisible && ( */}
      <Modal
        visible={isModelVisible && modelfor !== null}
        animationType="slide"
        transparent>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 5,
            overflow: 'hidden',
          }}
          onPress={() => setIsModelVisible(false)}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              // position: 'absolute',
              right: 0,
              bottom: 0,
              borderRadius: 12,
              overflow: 'hidden',
              //   borderWidth: 1,
              width: '94%',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                paddingHorizontal: '10%',
                paddingBottom: 20,
                width: '100%',
              }}>
              <View
                style={{
                  width: 50,
                  height: 5,
                  backgroundColor: 'grey',
                  marginVertical: 5,
                  borderRadius: 5,
                  alignSelf: 'center',
                }}
              />
              {/* app type model */}
              {modelfor == 'appType' &&
                (filterLoading ? (
                  <View>
                    <ActivityIndicator color={'green'} size={30} />
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      style={styles.filterItem}
                      onPress={() => {
                        setFilterLoading(true);
                        setAppOptHandler('whatsapp');
                      }}>
                      <Icon2
                        name={'whatsapp'}
                        size={20}
                        color={appOpt.type === 'whatsapp' ? 'green' : '#000'}
                      />
                      <Text
                        style={[
                          styles.filterItemText,
                          {
                            color:
                              appOpt.type === 'whatsapp' ? 'green' : '#000',
                          },
                        ]}>
                        whatsapp
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
                    />
                    <TouchableOpacity
                      style={styles.filterItem}
                      onPress={() => {
                        setFilterLoading(true);
                        setAppOptHandler('whatsappB');
                      }}>
                      {/* <Icon2
                  name={'whatsapp'}
                  size={20}
                  color={appOpt.type === 'whatsappB' ? 'green' : '#000'}
                /> */}
                      <Image
                        style={{height: 20, width: 20}}
                        source={
                          appOpt.type === 'whatsappB'
                            ? require('../assets/whatsapp-business-green.png')
                            : require('../assets/whatsapp-business.png')
                        }
                      />
                      <Text
                        style={[
                          styles.filterItemText,
                          {
                            color:
                              appOpt.type === 'whatsappB' ? 'green' : '#000',
                          },
                        ]}>
                        whatsapp business
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
                    />
                  </View>
                ))}

              {/* app theme model */}
              {modelfor == 'appTheme' && (
                <View>
                  <TouchableOpacity
                    style={styles.filterItem}
                    onPress={() => handleThemeFilter('System')}>
                    <Icon2
                      name={'whatsapp'}
                      size={20}
                      color={appTheme === 'System' ? 'green' : '#000'}
                    />
                    <Text
                      style={[
                        styles.filterItemText,
                        {color: appTheme === 'System' ? 'green' : '#000'},
                      ]}>
                      System default
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
                  />
                  <TouchableOpacity
                    style={styles.filterItem}
                    onPress={() => handleThemeFilter('Light')}>
                    <Icon2
                      name={'whatsapp'}
                      size={20}
                      color={appTheme === 'Light' ? 'green' : '#000'}
                    />
                    <Text
                      style={[
                        styles.filterItemText,
                        {color: appTheme === 'Light' ? 'green' : '#000'},
                      ]}>
                      Light
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
                  />
                  <TouchableOpacity
                    style={styles.filterItem}
                    onPress={() => handleThemeFilter('Dark')}>
                    <Icon2
                      name={'whatsapp'}
                      size={20}
                      color={appTheme === 'Dark' ? 'green' : '#000'}
                    />
                    <Text
                      style={[
                        styles.filterItemText,
                        {
                          color: appTheme === 'Dark' ? 'green' : '#000',
                        },
                      ]}>
                      Dark
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{backgroundColor: 'grey', height: 1, marginTop: 8}}
                  />
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  optContDiv: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#00000050',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  optCont: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  filterItem: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItemText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
});
