import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  BackHandler,
  Image,
  // TouchableOpacity,
  ToastAndroid,
  StatusBar,
  LogBox,
  Alert,
  NativeModules,
  Platform,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState, useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ControlIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import * as ScopedStoragePackage from 'react-native-scoped-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Pinchable from 'react-native-pinchable';
import {AppContext} from '../context/appContext';
import {useIsFocused, useRoute} from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';

const SelectedStatus = ({route, navigation}) => {
  const {uri, statusName, mime} = route.params;
  const [showControls, setShowControls] = useState(false);
  const [videoProp, setVideoProp] = useState({});
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [statusType, setStatusType] = useState(null);
  const [dActionLoading, setDActionLoading] = useState(false);
  const [sActionLoading, setSActionLoading] = useState(false);
  const [swActionLoading, setSWActionLoading] = useState(false);
  // const [newStatusName, setNewStatusName] = useState(statusName);
  const {getSavedStatuses, setScrollEnabled} = useContext(AppContext);
  const {ContentUriToAbsolutePathModule} = NativeModules;

  const video = /\.(mp4)$/i;
  const image = /\.(jpg|jpeg|png|gif)$/i;

  const WhatsAppSavedStatusDirectory = `${RNFS.DCIMDirectoryPath}/wi_status_saver/`;

  useEffect(() => {
    statusName.indexOf('.mp4') == -1
      ? setStatusType('IMG')
      : setStatusType('VID');

    checkIsSaved();

    console.log({WhatsAppSavedStatusDirectory});
    function backAction() {
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
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    // const unsubscribe = navigation.addListener('focus', () => {
    // setScrollEnabled(false)
    // });

    // Cleanup the event listener when the component is unmounted
    return () => {
      backHandler.remove();
      // unsubscribe;
      // setScrollEnabled(true)
    };
  }, []);

  const videoRef = useRef(null);

  const checkIsSaved = async () => {
    // setScrollEnabled(false)
    const savedFiles = await RNFS.readdir(WhatsAppSavedStatusDirectory);
    console.log({savedFiles});
    console.log({statusName});
    if (savedFiles) {
      const res = savedFiles.some(s => s.includes(statusName));
      if (res) {
        console.log('saved');
        setIsSaved(true);
      } else {
        setIsSaved(false);
        console.log('not saved');
      }
    }
  };

  const handleShareToWhatsapp = async url => {
    try {
      setSWActionLoading(true);
      let absolutePath = url;
      if (url.includes('content://')) {
        absolutePath = await ContentUriToAbsolutePathModule.resolveUriPath(url);
      }
      console.log('Absolute Path:', absolutePath);
      Share.shareSingle({
        message: 'This Status is shared using WI STATUS SAVER',
        url: absolutePath,
        social: Share.Social.WHATSAPP,
      })
        .then(res => {
          setSWActionLoading(false);
          console.log(res);
        })
        .catch(err => {
          setSWActionLoading(false);
          err && console.log(err);
        });

      //
    } catch (error) {
      setSWActionLoading(false);
      console.error('Error sharing to WhatsApp:', error.message);
    }
  };

  const handleShare = async url => {
    setSActionLoading(true);
    let absolutePath = url;
    if (url.includes('content://')) {
      absolutePath = await ContentUriToAbsolutePathModule.resolveUriPath(url);
    }
    console.log('Absolute Path:', absolutePath);
    Share.open({
      message: 'This Status is shared using WI STATUS SAVER',
      url: absolutePath,
    })
      .then(res => {
        setSActionLoading(false);
        console.log(res);
      })
      .catch(err => {
        setSActionLoading(false);
        err && console.log(err);
      });
  };

  const downloadStatusHandler = async () => {
    setDActionLoading(true);
    const persistedUris =
      await ScopedStoragePackage.getPersistedUriPermissions();

    // const sourceUrl = decodeURI(persistedUris[0]) + '/' + statusName;
    const sourceUrl = uri;
    const destUrl = WhatsAppSavedStatusDirectory;

    // if (statusType === 'IMG') {
    //   statusName = statusType + getCurrentTimeInFormat() + '.jpg';
    // } else {
    //   statusName = statusType + getCurrentTimeInFormat() + '.mp4';
    // }

    console.log({
      sourceUrl,
      destUrl,
      mime,
      statusName,
    });

    try {
      const isExist = await RNFS.exists(destUrl + '/' + statusName);
      if (isExist) {
        ToastAndroid.show('Status is Already Downloaded', ToastAndroid.SHORT);
        setDActionLoading(false);
      } else {
        createDestFile(sourceUrl, destUrl);
      }
    } catch (error) {
      setDActionLoading(false);
      console.log({errorToDownload: error});
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  };

  const createDestFile = async (sourceUrl, destUrl) => {
    try {
      const des = await ScopedStoragePackage.createFile(
        destUrl,
        statusName,
        mime,
      );
      console.log({des});
      if (des.uri) {
        copyFileFunction(sourceUrl, des.uri);
      } else {
        ToastAndroid.show('Download failed, try again', ToastAndroid.SHORT);
      }
    } catch (error) {
      setDActionLoading(false);
      console.log({error});
    }
  };

  const copyFileFunction = async (sourceUrl, destUrl) => {
    try {
      const fileStat = await ScopedStoragePackage.stat(sourceUrl);
      console.log({fileStat});
      await ScopedStoragePackage.copyFile(fileStat.uri, destUrl, res => {
        console.log({res});
        if (!res.success) {
          setDActionLoading(false);
          ToastAndroid.show(res.message, ToastAndroid.SHORT);
          RNFS.unlink(WhatsAppSavedStatusDirectory + statusName)
            .then(() => {
              // console.log('FILE DELETED');
              // ToastAndroid.show('Status deleted', ToastAndroid.SHORT);
              // navigation.goBack();
            })
            .catch(err => {
              setDActionLoading(false);
              console.log(err.message);
              ToastAndroid.show(err.message, ToastAndroid.SHORT);
            });
          return;
        }
        // ToastAndroid.show(
        //   res.message + 'at /storage/emulated/0/DCIM/wi_status_saver/',
        //   ToastAndroid.LONG,
        // );
        PushNotification.localNotification({
          channelId: 'wiStatusSaver.rohitbarate',
          title: statusName,
          message: 'status saved to DCIM/wi_status_saver/',
        });
        NativeModules.MediaScannerModule.scanFile(destUrl);
        checkIsSaved();
        setDActionLoading(false);
        getSavedStatuses();
      });
    } catch (error) {
      setDActionLoading(false);
      console.log({error});
    }
  };

  const onVideoPlaying = props => {
    setVideoProp(props);
  };

  const onReadyForDisplay = prop => {
    console.log('onReadyForDisplay');
    setIsVideoEnded(false);
    setShowControls(true);
    hideControls();
  };

  const hideControls = () => {
    const timerId = setTimeout(() => {
      !isVideoEnded && setShowControls(false);
    }, 5000);
    isVideoEnded && clearTimeout(timerId);
  };

  const onVideoEnd = props => {
    setIsVideoEnded(true);
    setShowControls(true);
    setIsVideoPaused(true);
    videoRef.current.seek(-videoProp.seekableDuration);
  };

  const videoError = () => {
    ToastAndroid.show('Status can not be loaded,try again', ToastAndroid.SHORT);
  };

  const deleteStatusHandler = async () => {
    setDActionLoading(true);
    Alert.alert(
      '',
      'Delete status?',
      [
        {
          text: 'cancel',
          onPress: () => {
            setDActionLoading(false);
          },
        },
        {
          text: 'delete',
          onPress: async () => {
            const isExist = await RNFS.exists(
              WhatsAppSavedStatusDirectory + statusName,
            );
            if (!isExist) {
              ToastAndroid.show('Status not available', ToastAndroid.SHORT);
              navigation.goBack();
              console.log({unlink: WhatsAppSavedStatusDirectory + statusName});
              setDActionLoading(false);
              return;
            }

            await RNFS.unlink(WhatsAppSavedStatusDirectory + statusName)
              .then(() => {
                console.log('FILE DELETED');
                // ToastAndroid.show('Status Deleted', ToastAndroid.SHORT);
                checkIsSaved();
                setDActionLoading(false);
                if (
                  uri.indexOf('content://com.android.externalstorage') === -1
                ) {
                  navigation.goBack();
                  getSavedStatuses();
                }
                PushNotification.localNotification({
                  channelId: 'wiStatusSaver.rohitbarate',
                  title: statusName,
                  message: 'status deleted successfully.',
                });
              })
              .catch(err => {
                setDActionLoading(false);
                console.log(err.message);
                ToastAndroid.show(err.message, ToastAndroid.SHORT);
              });
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <View style={styles.container}>
      {statusType === 'IMG' ? (
        <View
          style={{
            width: Dimensions.get('window').width - 20,
            backgroundColor: 'grey',
            alignItems: 'center',
            height: 500,
            borderRadius: 10,
            overflow: 'hidden',
          }}>
          <Pinchable>
            <Image source={{uri: uri}} style={styles.image} />
          </Pinchable>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setShowControls(!showControls);
            !showControls && hideControls();
          }}
          style={styles.videoView}>
          <StatusBar backgroundColor={'#074e54'} barStyle={'light-content'} />
          <Video
            ref={videoRef}
            source={{uri: uri}}
            style={styles.video}
            repeat={isVideoEnded}
            paused={isVideoPaused}
            // fullscreen={true}
            posterResizeMode="contain"
            resizeMode="contain"
            onProgress={onVideoPlaying}
            onEnd={props => onVideoEnd(props)}
            onReadyForDisplay={onReadyForDisplay}
            onError={videoError}
          />
          {showControls && (
            <View style={styles.customControlView}>
              {/* close status button */}
              <View style={styles.customControlViewHeader}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Icon
                    style={{
                      alignSelf: 'flex-end',
                      paddingBottom: 10,
                      paddingHorizontal: 10,
                    }}
                    name="close"
                    size={30}
                    color={'#fff'}
                    onPress={() => {}}
                  />
                </TouchableOpacity>
              </View>
              {/* play/pause/reload  button */}
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  backgroundColor: '#212121',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 60,
                  width: 60,
                  borderRadius: 60,
                  opacity: 0.8,
                  paddingLeft: 2,
                }}
                onPress={() => {
                  setIsVideoPaused(!isVideoPaused);
                  !showControls && hideControls();
                  isVideoEnded && setIsVideoEnded(false);
                }}>
                <Icon
                  style={{
                    alignSelf: 'center',
                    opacity: 1,
                    // paddingBottom: 10,
                    // paddingHorizontal: 10,
                  }}
                  name={
                    isVideoEnded
                      ? 'reload'
                      : isVideoPaused
                      ? 'play-sharp'
                      : 'pause-outline'
                  }
                  size={50}
                  color={'#ffffff'}
                />
              </TouchableOpacity>

              {/* time & progress bar */}
              <View style={styles.customControlViewFooter}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    paddingHorizontal: 10,
                  }}>
                  <Text style={{color: '#fff'}}>
                    {videoProp.currentTime
                      ? '00.' + Math.ceil(videoProp.currentTime)
                      : '00.00'}
                  </Text>
                  <Text style={{color: '#fff'}}>
                    {videoProp.seekableDuration
                      ? '00.' + Math.ceil(videoProp.seekableDuration)
                      : '00.00'}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    height: 5,
                    backgroundColor: 'grey',
                    marginTop: 5,
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width:
                        (Math.ceil(videoProp.currentTime) /
                          Math.ceil(videoProp.seekableDuration)) *
                          100 +
                        '%',
                      backgroundColor: 'green',
                    }}
                  />
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
      )}

      <View style={styles.btnView}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleShare(uri)}
          style={[
            styles.button,
            {height: 50, width: 50, borderRadius: 50, marginHorizontal: 10},
          ]}>
          {sActionLoading ? (
            <ActivityIndicator color={'#fff'} size={30} />
          ) : (
            <Icon name="ios-share-social-outline" size={30} color={'#fff'} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            isSaved ? deleteStatusHandler() : downloadStatusHandler();
          }}
          style={[
            styles.button,
            {height: 65, width: 65, borderRadius: 65, marginHorizontal: 10},
          ]}>
          {dActionLoading ? (
            <ActivityIndicator color={'#fff'} size={30} />
          ) : (
            <Icon
              name={isSaved ? 'trash-outline' : 'ios-arrow-down'}
              size={40}
              color={'#fff'}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleShareToWhatsapp(uri)}
          style={[
            styles.button,
            {height: 50, width: 50, borderRadius: 50, marginHorizontal: 10},
          ]}>
          {swActionLoading ? (
            <ActivityIndicator color={'#fff'} size={30} />
          ) : (
            <Icon name="logo-whatsapp" size={30} color={'#fff'} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectedStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    // aspectRatio:
    //   Dimensions.get('window').width / Dimensions.get('window').height,
    backgroundColor: '#000',
    width: Dimensions.get('window').width - 20,
    height: 500,
    // borderRadius: 10,
    resizeMode: 'contain',
  },
  videoView: {
    borderRadius: 10,
    height: 500,
    overflow: 'hidden',
    width: Dimensions.get('window').width - 20,
  },
  video: {
    // aspectRatio:
    //   Dimensions.get('window').width / Dimensions.get('window').height,
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
  customControlView: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#00000040',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  customControlViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  customControlViewFooter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    // marginBottom: 10,
  },
  button: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    // position: 'absolute',
    bottom: 10,
  },
});
