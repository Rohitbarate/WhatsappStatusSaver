import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState} from 'react';
import {NativeModules, ToastAndroid,PermissionsAndroid} from 'react-native';
const {ScopedStorage} = NativeModules;
import * as ScopedStoragePackage from 'react-native-scoped-storage';

// Create the user context
export const AppContext = createContext();

// Create a provider component for the user context
export const AppProvider = ({children}) => {
  const [isExtPermissionGranted, setIsExtPermissionGranted] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All Statuses'); // opts : 'IMAGES','VIDEOS','ALL' .etc
  const [appVersion, setAppVersion] = useState(null);
  const [accessLoading, setAccessLoading] = useState(false);
  const [showDilogue, setShowDialogue] = useState(false);
  const [statuses, setStatuses] = useState({
    allStatuses: [],
    currentMedia: '',
    mediaName: '',
  });
  const [savedStatuses, setSavedStatuses] = useState({
    allStatuses: [],
    currentMedia: '',
    mediaName: '',
  });

  // request scoped storage permission
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

  // get statuses (recent)
  const getStatuses = async () => {
    const onlyVideos = /\.(mp4)$/i;
    const onlyImages = /\.(jpg|jpeg|png|gif)$/i;
    const AllMedia = /\.(jpg|jpeg|png|gif|mp4|mov)$/i;

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

  //  check scoped storage permission
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

  //  read ext. storage permission (<v29)
  const requestExtPermissions = async () => {
    try {
      return PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ])
        .then(result => {
          if (
            result['android.permission.READ_EXTERNAL_STORAGE']  === 'granted'
          ) {
            console.log('permission granted');
            setIsExtPermissionGranted(true);
            //   loadStatuses();
            return true;
          } else if (
            result['android.permission.READ_EXTERNAL_STORAGE']  ===
              'never_ask_again'
          ) {
            setIsExtPermissionGranted(false);
            ToastAndroid.show(
              'Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue',
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

  // Define the value object that will be provided to the consumer components
  const value = {
    requestScopedPermissionAccess,
    getData,
    storeData,
    getAccess,
    getStatuses,
    setIsExtPermissionGranted,
    setIsAccessGranted,
    loading,
    setLoading,
    accessLoading,
    setAccessLoading,
    showDilogue,
    setShowDialogue,
    statuses,
    setStatuses,
    savedStatuses,
    setSavedStatuses,
    filter,
    setFilter,
    requestExtPermissions
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
