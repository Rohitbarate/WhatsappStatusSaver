import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
  StyleSheet,
  Modal,
  Dimensions,
  BackHandler,
  ActivityIndicator,
  NativeModules,
  StatusBar,
} from 'react-native';
import RNFS from 'react-native-fs';
import StatusView from '../components/StatusView';
import {
  checkMultiple,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
const {ScopedStorage} = NativeModules;
import * as ScopedStoragePackage from 'react-native-scoped-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FilterBtn from '../components/FilterBtn';

const RecentScreen = ({navigation}) => {
  const [isAllPermissionGranted, setIsAllPermissionGranted] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All Statuses'); // opts : 'IMAGES','VIDEOS','ALL' .etc
  const [accessLoading, setAccessLoading] = useState(false);
  const [showDilogue, setShowDialogue] = useState(false);
  const [statuses, setStatuses] = useState({
    allStatuses: [],
    currentMedia: '',
    mediaName: '',
  });
  const [isCrntStatusVisible, setIsCrntStatusVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const {height, width} = Dimensions.get('window');

  const flatListRef = useRef(null);

  useEffect(() => {
    getAccess();
    requestFileAccess();
    // setLoading(true)
    getStatuses();

    const backAction = () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Exit', onPress: () => BackHandler.exitApp()},
          ],
          {cancelable: false},
        );
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // const onScreenFocus = navigation.addListener('focus', () => {
    //   getStatuses();
    //   console.log('focus');
    // });

    // Cleanup the event listener when the component is unmounted
    return () => {
      // onScreenFocus;
      backHandler.remove();
    };
  }, [filter]);

  const onlyVideos = /\.(mp4)$/i;
  const onlyImages = /\.(jpg|jpeg|png|gif)$/i;
  const AllMedia = /\.(jpg|jpeg|png|gif|mp4|mov)$/i;

  const getStatuses = async () => {
    setLoading(true);
    const {hasAccess, folderUrl} = await getData();
    const persistedUris =
      await ScopedStoragePackage.getPersistedUriPermissions();
    setIsAccessGranted(hasAccess);

    console.log({persistedUris});
    try {
      if (hasAccess && persistedUris.length !== 0 && folderUrl.length !== 0) {
        console.log('fetch status');
        ToastAndroid.show('Fetching New Statuses...', ToastAndroid.LONG);
        const files = await ScopedStoragePackage.listFiles(
          persistedUris[0],
          'ascii',
        );

        if (filter === 'Images') {
          const filterFiles = files.filter(file => onlyImages.test(file.name));
          // console.log({filterFiles});
          setStatuses(preState => ({...preState, allStatuses: filterFiles}));
        } else if (filter === 'Videos') {
          const filterFiles = files.filter(file => onlyVideos.test(file.name));
          // console.log({filterFiles});
          setStatuses(preState => ({...preState, allStatuses: filterFiles}));
        } else {
          const filterFiles = files.filter(file => AllMedia.test(file.name));
          // console.log({filterFiles});
          setStatuses(preState => ({...preState, allStatuses: filterFiles}));
        }
        setLoading(false);
      } else {
        console.log('else');
        setLoading(false);
        setIsAccessGranted(false);
      }
    } catch (error) {
      setLoading(false);
      console.log({getAllStatuses_error: {error}});
    }
  };

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
          // ToastAndroid.show(
          //   'Welcome back to WIStatusSaver 🙋‍♂️🙋‍♂️',
          //   ToastAndroid.SHORT,
          // );
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

  const requestScopedPermissionAccess = async () => {
    try {
      setAccessLoading(true);
      const res = await ScopedStorage.requestAccessToStatusesFolder();
      console.log({mainRes: res});
      if (res !== null && res.includes('.Statuses')) {
        // user selected correct folder
        await storeData({hasAccess: true, folderUrl: res});
        setAccessLoading(false);
        ToastAndroid.show('Access Granted 🎉🎉', ToastAndroid.LONG);
        setAccessLoading(false);
        setShowDialogue(false);
        getStatuses();
      } else {
        // user selected wrong folder
        ToastAndroid.show(
          'You might selected the wrong folder.',
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

  const requestFileAccess = async () => {
    try {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ])
        .then(result => {
          if (
            result['android.permission.READ_EXTERNAL_STORAGE'] ===
            //  &&
            // result['android.permission.WRITE_EXTERNAL_STORAGE']
            'granted'
          ) {
            console.log('permission granted');
            setIsAllPermissionGranted(true);
            //   loadStatuses();
            return true;
          } else if (
            result['android.permission.READ_EXTERNAL_STORAGE'] ===
            //  ||
            // result['android.permission.WRITE_EXTERNAL_STORAGE']
            'never_ask_again'
          ) {
            setIsAllPermissionGranted(false);
            ToastAndroid.show(
              'Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow file permissions to continue',
              ToastAndroid.LONG,
            );
            return false;
          }
        })
        .catch(err => console.log(err));
    } catch (error) {
      console.log({error});
    }
  };

  const handleScrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({offset: 0, animated: true});
    }
  };

  // const currentTime = new Date();

  const sortedData = [...statuses.allStatuses].sort((a, b) => {
    return b.lastModified - a.lastModified;
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // paddingHorizontal:10
      }}>
      {/* file loading component */}
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
                <TouchableOpacity
                  onPress={requestScopedPermissionAccess}
                  style={styles.prmBtn}>
                  <Text style={styles.prmBtnText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}

      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          padding: 10,
          width: width,
        }}>
        <Text style={{color: '#000000', fontWeight: '400', fontSize: 13}}>
          {sortedData.length} items in total
        </Text>
        {/* filter btn */}
        <FilterBtn
          filterModalVisible={filterModalVisible}
          setFilterModalVisible={setFilterModalVisible}
          filter={filter}
          setFilter={setFilter}
          handleScrollToTop={handleScrollToTop}
        />
      </View>

      {loading && statuses.allStatuses.length === 0 && (
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
          <ActivityIndicator color={'green'} size={30} />
        </View>
      )}

      {statuses.allStatuses.length !== 0 ? (
        <FlatList
          refreshing={loading}
          bounces={true}
          onRefresh={() => getStatuses()}
          ref={flatListRef}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{right: 2}}
          numColumns={2}
          data={sortedData}
          keyExtractor={item => item.name}
          renderItem={({item}) => (
            <StatusView
              item={item}
              isCrntStatusVisible={isCrntStatusVisible}
              setIsCrntStatusVisible={setIsCrntStatusVisible}
              setStatuses={setStatuses}
              navigation={navigation}
              statuses={statuses}
              getStatuses={getStatuses}
            />
          )}
        />
      ) : (
        !loading && !showDilogue &&(
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: '#000', fontSize: 20, fontWeight: '500'}}>
              Status not found,
            </Text>
            <Text style={{color: '#00000080', fontSize: 14}}>
              See statuses in whatsapp app
            </Text>
            <TouchableOpacity onPress={getStatuses} style={styles.prmBtn}>
              <Text style={styles.prmBtnText}>Reload</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
};

export default RecentScreen;

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
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  prmBtn: {
    borderRadius: 10,
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
