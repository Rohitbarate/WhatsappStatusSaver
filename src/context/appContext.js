import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState} from 'react';
import {
  NativeModules,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
} from 'react-native';
const {ScopedStorage} = NativeModules;
import * as ScopedStoragePackage from 'react-native-scoped-storage';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';

// Create the user context
export const AppContext = createContext();

// Create a provider component for the user context
export const AppProvider = ({children}) => {
  const [isExtPermissionGranted, setIsExtPermissionGranted] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('All Statuses'); // opts : 'IMAGES','VIDEOS','ALL' .etc
  const [savedFilter, setSavedFilter] = useState('All Statuses'); // opts : 'IMAGES','VIDEOS','ALL' .etc
  const [appVersion, setAppVersion] = useState(null);
  const [accessLoading, setAccessLoading] = useState(false);
  const [showDilogue, setShowDialogue] = useState(false);
  const [isLatestVersion, setIsLatestVersion] = useState(false);
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

  // const WhatsAppSavedStatusDirectory = `${RNFS.DocumentDirectoryPath}/Media/Statuses/`;
  const WhatsAppSavedStatusDirectory = `${RNFS.DCIMDirectoryPath}/status_saver/`;
  console.log({WhatsAppSavedStatusDirectory});

  const onlyVideos = /\.(mp4)$/i;
  const onlyImages = /\.(jpg|jpeg|png|gif)$/i;
  const AllMedia = /\.(jpg|jpeg|png|gif|mp4|mov)$/i;
  // request scoped storage permission
  const requestScopedPermissionAccess = async () => {
    try {
      console.log('req start');
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
        await getStatuses();
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
    const appV = Platform.Version;
    let files;
    setLoading(true);
    const {hasAccess, folderUrl} = await getData();
    setIsAccessGranted(hasAccess == null ? false : hasAccess);
    const persistedUris =
      await ScopedStoragePackage.getPersistedUriPermissions();

    console.log({persistedUris});
    console.log({hasAccess, folderUrl, isLatestVersion});
    try {
      if (
        hasAccess == true &&
        persistedUris.length !== 0 &&
        folderUrl.length !== 0 &&
        appV >= 29
      ) {
        console.log('fetch status');
        ToastAndroid.show('Fetching New Statuses...', ToastAndroid.LONG);
        files = await ScopedStoragePackage.listFiles(folderUrl, 'ascii');
      } else if (hasAccess == true && appV < 29) {
        console.log('fetch status old--v ');
        ToastAndroid.show('Fetching New Statuses...', ToastAndroid.LONG);
        files = await RNFS.readDir(folderUrl);
        setLoading(false);
      } else {
        console.log('else');
        setLoading(false);
        setIsAccessGranted(false);
      }
      console.log({rcFiles: files});
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
        return false;
      } else {
        // console.log('else');
        if (folderAccess !== null && persistedUris.length !== 0) {
          // console.log('access');
          setAccessLoading(false);
          setShowDialogue(false);
          await getStatuses();
          // ToastAndroid.show(
          //   'Welcome back to WIStatusSaver 🙋‍♂️🙋‍♂️',
          //   ToastAndroid.SHORT,
          // );
          return true;
        } else if (folderAccess !== null && persistedUris.length === 0) {
          await AsyncStorage.clear();
          setAccessLoading(false);
          setShowDialogue(true);
          return false;
        } else {
          await ScopedStoragePackage.releasePersistableUriPermission(
            persistedUris[0],
          );
          setAccessLoading(false);
          setShowDialogue(true);
          return false;
        }

        // await AsyncStorage.clear();
      }
    } catch (error) {
      console.log(error);
      setAccessLoading(false);
      setShowDialogue(true);
      return false;
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
      const read_storage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const write_storage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (read_storage === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        setIsExtPermissionGranted(true);
        await storeData({
          hasAccess: true,
          folderUrl:
            'file:///storage/emulated/0/Android/media/com.whatsapp/Whatsapp/Media/.Statuses/',
        });
      } else {
        console.log('Camera permission denied');
        setIsExtPermissionGranted(false);
      }
    } catch (err) {
      console.warn('Error while requesting storage permissions:', err);
      setIsExtPermissionGranted(false);
    }
  };

  const getSavedStatuses = async () => {
    try {
      console.log('getSavedStatuses called !');
      setLoading(true);
      // const appV = Platform.Version;
      // if (appV >= 29) {
      //   setIsExtPermissionGranted(true);
      const isPathExist = await RNFS.exists(WhatsAppSavedStatusDirectory);
      // console.log({isPathExist});
      if (!isPathExist) {
        await RNFS.mkdir(WhatsAppSavedStatusDirectory);
      }
      const files = await RNFS.readDir(WhatsAppSavedStatusDirectory);
      console.log({files});
      if (savedFilter === 'Images') {
        const filterFiles = files.filter(file => onlyImages.test(file.name));
        console.log({images: filterFiles});
        setSavedStatuses(preState => ({...preState, allStatuses: filterFiles}));
        if (filterFiles.length === 0) {
          ToastAndroid.show('Status not found', ToastAndroid.SHORT);
        }
      } else if (savedFilter === 'Videos') {
        const filterFiles = files.filter(file => onlyVideos.test(file.name));
        console.log({videos: filterFiles});
        setSavedStatuses(preState => ({...preState, allStatuses: filterFiles}));
        if (filterFiles.length === 0) {
          ToastAndroid.show('Status not found', ToastAndroid.SHORT);
        }
      } else {
        const filterFiles = files.filter(file => AllMedia.test(file.name));
        setSavedStatuses(preState => ({...preState, allStatuses: filterFiles}));
        if (filterFiles.length === 0) {
          ToastAndroid.show('Status not found', ToastAndroid.SHORT);
        }

        console.log({All: filterFiles});
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log({getAllStatuses_error_saved: error});
    }
  };

  const shouldShowRationale = async () => {
    try {
      const readStorageStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      // await PermissionsAndroid.shouldShowRequestPermissionRationale(
      //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      // );

      const writeStorageStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      // await PermissionsAndroid.shouldShowRequestPermissionRationale(
      //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      // );

      // Return true if any of the permissions still need a rationale
      return readStorageStatus || writeStorageStatus;
    } catch (err) {
      console.warn('Error while checking rationale:', err);
      return false;
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
    isExtPermissionGranted,
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
    requestExtPermissions,
    isLatestVersion,
    setIsLatestVersion,
    getSavedStatuses,
    savedFilter,
    setSavedFilter,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
