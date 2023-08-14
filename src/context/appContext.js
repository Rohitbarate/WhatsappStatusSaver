import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useCallback, useState} from 'react';
import {
  NativeModules,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
const {ScopedStorage} = NativeModules;
import * as ScopedStoragePackage from 'react-native-scoped-storage';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import SendIntentAndroid from 'react-native-send-intent';

// Create the user context
export const AppContext = createContext();

// Create a provider component for the user context
export const AppProvider = ({children}) => {
  const [isExtPermissionGranted, setIsExtPermissionGranted] = useState(false);
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOpenAppSettings, setShowOpenAppSettings] = useState(false);
  const [sLoading, setSLoading] = useState(false);
  const [filter, setFilter] = useState('Videos'); // opts : 'IMAGES','VIDEOS','ALL' .etc
  const [savedFilter, setSavedFilter] = useState('Videos'); // opts : 'IMAGES','VIDEOS','ALL' .etc
  const [appVersion, setAppVersion] = useState(null);
  const [appOpt, setAppOpt] = useState({type: 'whatsapp', isSelected: false});
  const [accessLoading, setAccessLoading] = useState(false);
  const [showDilogue, setShowDialogue] = useState(false);
  const [showAppTypeDilogue, setShowAppTypeDilogue] = useState(false);
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
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // const WhatsAppSavedStatusDirectory = `${RNFS.DocumentDirectoryPath}/Media/Statuses/`;
  const WhatsAppSavedStatusDirectory = `${RNFS.DCIMDirectoryPath}/wi_status_saver/`;
  // console.log({WhatsAppSavedStatusDirectory});

  const onlyVideos = /\.(mp4)$/i;
  const onlyImages = /\.(jpg|jpeg|png|gif)$/i;
  const AllMedia = /\.(jpg|jpeg|png|gif|mp4|mov)$/i;

  // useCallback(() => {
  //   const route = useRoute();
  //   const routeName = getFocusedRouteNameFromRoute(route);
  //   console.log({routeName});
  // }, []);

  // request scoped storage permission
  const requestScopedPermissionAccess = async () => {
    try {
      console.log('req start : ', appOpt.type);
      setAccessLoading(true);
      const res = await ScopedStorage.requestAccessToStatusesFolder(
        appOpt.type,
      );
      console.log({mainRes: res});
      if (
        !res.success &&
        res.msg === 'The selected app is not installed on the device.'
      ) {
        // user selected wrong app type
        ToastAndroid.show(
          'You selected App type not installed in your device.',
          ToastAndroid.LONG,
        );
        await AsyncStorage.removeItem('folderAccess');
        setShowAppTypeDilogue(true);
      } else if (res !== null && res.success && res.uri.includes('.Statuses')) {
        // user selected correct folder
        await storeData({hasAccess: true, folderUrl: res.uri});
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
      console.log({requestScopedPermissionAccess_error: error});
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
    const folderAccess = await getData();
    if (folderAccess === null) {
      setAccessLoading(false);
      setShowDialogue(true);
      return;
    }
    const persistedUris =
      await ScopedStoragePackage.getPersistedUriPermissions();
    console.log({persistedUris});
    console.log({
      acc: folderAccess.hasAccess,
      folderAccess,
    });
    try {
      if (
        folderAccess.hasAccess === true &&
        persistedUris.length !== 0 &&
        folderAccess.folderUrl.length !== 0 &&
        Platform.Version >= 29
      ) {
        // setLoading(true);
        console.log('fetch status Q');
        ToastAndroid.show('Fetching New Statuses...', ToastAndroid.LONG);
        files = await ScopedStoragePackage.listFiles(
          folderAccess.folderUrl,
          'ascii',
        );
        setLoading(false);
      } else if (folderAccess.hasAccess == true && Platform.Version < 29) {
        console.log('fetch status old--v ');
        ToastAndroid.show('Fetching New Statuses...', ToastAndroid.LONG);
        files = await RNFS.readDir(folderAccess.folderUrl);
        setLoading(false);
      } else {
        console.log('else get statuses()');
        setLoading(false);
        setIsAccessGranted(false);
        setShowDialogue(true);
        return;
      }
      // console.log({rcFiles: files});
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
      console.log({isLatestVersionM: Platform.Version >= 29});
      // get folder link stored in asyncStorage
      const folderAccess = await getData();
      if (folderAccess === null) {
        // user is new
        setAccessLoading(false);
        setShowDialogue(true);
        return;
      }

      // cond for 10+ version
      if (Platform.Version >= 29) {
        console.log(' 2️⃣2️⃣ getAccess() called 10+ version');
        const persistedUris =
          await ScopedStoragePackage.getPersistedUriPermissions();
        // console.log({persistedUris});

        if (folderAccess.hasAccess === false && persistedUris.length === 0) {
          // user is new
          setAccessLoading(false);
          setShowDialogue(true);
        } else {
          if (folderAccess.hasAccess === true && persistedUris.length !== 0) {
            setAccessLoading(false);
            setShowDialogue(false);
            await getStatuses();
            await requestExtPermissions();
          } else if (folderAccess !== null && persistedUris.length === 0) {
            // user removed scoped permission manually
            await AsyncStorage.removeItem('folderAccess');
            setAccessLoading(false);
            setShowDialogue(true);
          } else {
            await ScopedStoragePackage.releasePersistableUriPermission(
              persistedUris[0],
            );
            setAccessLoading(false);
            setShowDialogue(true);
          }
        }
      } else {
        // cond for 10- version
        console.log('getAccess() called 10- version');
        // check ext storage permission

        if (!isExtPermissionGranted && folderAccess.hasAccess === false) {
          // user is new
          setAccessLoading(false);
          setShowDialogue(true);
        } else {
          if (folderAccess.hasAccess === true && isExtPermissionGranted) {
            setAccessLoading(false);
            setShowDialogue(false);
            await getStatuses();
          } else if (folderAccess !== null && !isExtPermissionGranted) {
            console.log(' 💥💥💥 ext permission not found');
            await AsyncStorage.removeItem('folderAccess');
            setAccessLoading(false);
            setShowDialogue(true);
          } else {
            setAccessLoading(false);
            setShowDialogue(true);
          }
        }
      }
      // get access folder links stored in persistedUris
    } catch (error) {
      console.log(error);
      setAccessLoading(false);
      setShowDialogue(true);
      return false;
    }
  };

  // save storage permission
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
  // get storage permission
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
          title: 'Wi status saver needs read storage Permission',
          message:
            'Wi status saver needs access to your storage ' +
            'so you can download the statuses',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (read_storage === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Read storage permission granted');
        // setIsExtPermissionGranted(true);

        const write_storage = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (write_storage === PermissionsAndroid.RESULTS.GRANTED) {
          // You can now read and write to external storage
          console.log('Write storage permission granted');
          setShowOpenAppSettings(false);
          setIsExtPermissionGranted(true);
          if (Platform.Version < 29) {
            await storeData({
              hasAccess: true,
              folderUrl:
                'file:///storage/emulated/0/Android/media/com.whatsapp/Whatsapp/Media/.Statuses/',
            });
            await getStatuses();
          }
          await getSavedStatuses();
        } else if (
          write_storage === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          console.log('Write storage permission denied permanently');
          setIsExtPermissionGranted(false);
          setShowOpenAppSettings(true);
          ToastAndroid.show(
            'Go to Settings > Permissions > Allow to Write Storage Permission',
            ToastAndroid.LONG,
          );
        } else {
          console.log('Write storage permission denied');
          setIsExtPermissionGranted(false);
          setShowOpenAppSettings(false);
        }
      } else if (read_storage === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Read storage permission denied permanently');
        setIsExtPermissionGranted(false);
        // Prompt the user to open app settings
        ToastAndroid.show(
          'Go to Settings > Permissions > Allow to Read Storage Permission',
          ToastAndroid.LONG,
        );
        setShowOpenAppSettings(true);
        // openAppSettings();
      } else {
        console.log('Read storage permission denied');
        setIsExtPermissionGranted(false);
        setShowOpenAppSettings(false);
      }
    } catch (err) {
      console.warn('Error while requesting storage permissions:', err);
      setIsExtPermissionGranted(false);
      setShowOpenAppSettings(false);
    }
  };

  // check ext. storage permission
  const checkExtPermissions = async () => {
    try {
      setAccessLoading(true);
      const readPermissionStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      const writePermissionStatus = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (readPermissionStatus && writePermissionStatus) {
        console.log('Read and write storage permissions are granted');
        setIsExtPermissionGranted(true);
      } else {
        console.log('Read and write storage permissions are not granted');
        setIsExtPermissionGranted(false);
      }
      setAccessLoading(false);
    } catch (error) {
      console.log(error);
      setAccessLoading(false);
      // setShowDialogue(true);
      return false;
    }
  };

  // get saved statuses in device DCIM/wi_status_saver
  const getSavedStatuses = async () => {
    try {
      console.log('getSavedStatuses called !');
      setSLoading(true);
      const isPathExist = await RNFS.exists(WhatsAppSavedStatusDirectory);
      // console.log({isPathExist});
      if (!isPathExist) {
        await RNFS.mkdir(WhatsAppSavedStatusDirectory);
      }
      const files = await RNFS.readDir(WhatsAppSavedStatusDirectory);
      // console.log({files});
      if (savedFilter === 'Images') {
        const filterFiles = files.filter(file => onlyImages.test(file.name));
        // console.log({images: filterFiles});
        setSavedStatuses(preState => ({...preState, allStatuses: filterFiles}));
        if (filterFiles.length === 0) {
          ToastAndroid.show('Status not found', ToastAndroid.SHORT);
        }
      } else if (savedFilter === 'Videos') {
        const filterFiles = files.filter(file => onlyVideos.test(file.name));
        // console.log({videos: filterFiles});
        const trashedRemovedF = filterFiles.filter(file => {
          return !file.name.includes('.trashed');
        });
        setSavedStatuses(preState => ({
          ...preState,
          allStatuses: trashedRemovedF,
        }));
        if (filterFiles.length === 0) {
          ToastAndroid.show('Status not found', ToastAndroid.SHORT);
        }
      } else {
        const filterFiles = files.filter(file => AllMedia.test(file.name));
        const trashedRemovedF = filterFiles.filter(file => {
          return file.name !== '.trashed';
        });
        setSavedStatuses(preState => ({
          ...preState,
          allStatuses: trashedRemovedF,
        }));
        if (filterFiles.length === 0) {
          ToastAndroid.show('Status not found', ToastAndroid.SHORT);
        }

        // console.log({All: filterFiles});
      }
      setSLoading(false);
    } catch (error) {
      setSLoading(false);
      console.log({getAllStatuses_error_saved: error});
    }
  };

  // save app type
  const storeWT = async value => {
    try {
      // value :{hasAccess:boolean,folderUrl:String}
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('whatsappOpt', jsonValue);
      // checkWT();
    } catch (e) {
      console.log('error while storing whatsapp Options : ', e);
    }
  };

  // get app type
  const getWT = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('whatsappOpt');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('error while getting Whatsapp Options : ', e);
    }
  };

  //  change app type
  const changeAppOptHandler = async apptype => {
    console.log({changeAppOptHandler_log: apptype});

    const result = await SendIntentAndroid.isAppInstalled(
      apptype === 'whatsapp' ? 'com.whatsapp' : 'com.whatsapp.w4b',
    );
    console.log({result});
    if (!result) {
      ToastAndroid.show(
        `${
          apptype == 'whatsappB' ? '@ Whatsapp Business' : '@' + apptype
        } not found in your device. `,
        ToastAndroid.LONG,
      );
    }
    return result;
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
    appOpt,
    setAppOpt,
    setSLoading,
    sLoading,
    showAppTypeDilogue,
    setShowAppTypeDilogue,
    changeAppOptHandler,
    getWT,
    storeWT,
    scrollEnabled,
    setScrollEnabled,
    appVersion,
    setAppVersion,
    showOpenAppSettings,
    setShowOpenAppSettings,
    checkExtPermissions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
