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
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ControlIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import * as ScopedStoragePackage from 'react-native-scoped-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Pinchable from 'react-native-pinchable';

const SelectedStatus = ({route, navigation}) => {
  const {uri, statusName, mime} = route.params;
  const [showControls, setShowControls] = useState(false);
  const [videoProp, setVideoProp] = useState({});
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const video = /\.(mp4)$/i;
  const image = /\.(jpg|jpeg|png|gif)$/i;
  const WhatsAppStatusDirectory = `${RNFS.DocumentDirectoryPath}/Media/Statuses/`;

  // LogBox.ignoreLogs([
  //   'Non-serializable values were found in the navigation state',
  // ]);

  useEffect(() => {
    checkIsSaved();

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

    // Cleanup the event listener when the component is unmounted
    return () => backHandler.remove();
  }, []);

  const videoRef = useRef(null);

  const checkIsSaved = async () => {
    const savedFiles = await RNFS.readdir(WhatsAppStatusDirectory);
    console.log({savedFiles});
    if (savedFiles) {
      const res = savedFiles.indexOf(statusName);
      if (res !== -1) {
        console.log('saved');
        setIsSaved(true);
      } else {
        console.log('not saved');
      }
    }
  };

  const handleShareToWhatsapp = async url => {
    let link;
    try {
      Share.isPackageInstalled('com.whatsapp')
        .then(response => {
          console.log({response});
          response.isInstalled = true;
          if (response.isInstalled) {
            ToastAndroid.show('Sharing with Whatsapp', ToastAndroid.SHORT);
            RNFS.stat(url)
              .then(res => {
                console.log({share: res});
                link = res.path;
              })
              .catch(er => {
                console.log({er});
              });
            Share.shareSingle({
              url: uri,
              social: Share.Social.WHATSAPP,
            }).catch(err => {
              err && console.log(err);
            });
          } else {
            ToastAndroid.show('error: Whatsapp not found', ToastAndroid.LONG);
          }
        })
        .catch(error => {
          console.log(error);
          // { error }
        });
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error.message);
    }
  };

  const handleShare = async url => {
    console.log({url});
    try {
      const persistedUris =
        await ScopedStoragePackage.getPersistedUriPermissions();
      console.log(decodeURIComponent(persistedUris[0]) + '/' + statusName);
      Share.open({
        url: decodeURIComponent(persistedUris[0]) + '/' + statusName,
        failOnCancel: false,
      }).catch(error => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      });
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
    }
  };

  const downloadStatusHandler = async (url, statusName) => {
    const persistedUris =
      await ScopedStoragePackage.getPersistedUriPermissions();

    // const sourceUrl = decodeURI(persistedUris[0]) + '/' + statusName;
    const sourceUrl =
      'content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses/document/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses%2F' +
      statusName;
    const destUrl = 'data/user/0/com.wistatussaver/files/Media/Statuses';

    console.log({
      sourceUrl,
      destUrl,
      mime,
    });

    try {
      const isExist = await RNFS.exists(destUrl + '/' + statusName);
      if (isExist) {
        ToastAndroid.show('Status is Already Downloaded', ToastAndroid.SHORT);
      } else {
        createDestFile(sourceUrl, destUrl);
      }
    } catch (error) {
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
      console.log({error});
    }
  };

  const copyFileFunction = async (sourceUrl, destUrl) => {
    const fileStat = await ScopedStoragePackage.stat(sourceUrl);
    console.log({fileStat});
    await ScopedStoragePackage.copyFile(fileStat.uri, destUrl, res => {
      console.log({res});
      ToastAndroid.show(res, ToastAndroid.SHORT);
      checkIsSaved();
    });
  };

  const onVideoPlaying = props => {
    setVideoProp(props);
  };

  const onReadyForDisplay = prop => {
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

  const deleteStatusHandler = async (uri, statusName) => {
    Alert.alert(
      '',
      'Delete status?',
      [
        {
          text: 'cancel',
        },
        {
          text: 'delete',
          onPress: async () => {
            await RNFS.unlink(WhatsAppStatusDirectory + statusName)
              .then(() => {
                console.log('FILE DELETED');
                ToastAndroid.show('Status deleted', ToastAndroid.SHORT);

                navigation.goBack();
              })
              .catch(err => {
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
      {statusName.indexOf('.jpg' || '.jpeg' || '.png') !== -1 ? (
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
            fullscreen={true}
            posterResizeMode="contain"
            resizeMode="contain"
            onProgress={onVideoPlaying}
            onEnd={props => onVideoEnd(props)}
            onReadyForDisplay={onReadyForDisplay}
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
          onPress={() => handleShare(uri)}
          style={[
            styles.button,
            {height: 50, width: 50, borderRadius: 50, marginHorizontal: 10},
          ]}>
          <Icon name="ios-share-social-outline" size={30} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            isSaved
              ? deleteStatusHandler(uri, statusName)
              : downloadStatusHandler(uri, statusName);
          }}
          style={[
            styles.button,
            {height: 65, width: 65, borderRadius: 65, marginHorizontal: 10},
          ]}>
          <Icon
            name={isSaved ? 'trash-outline' : 'ios-arrow-down'}
            size={40}
            color={'#fff'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleShareToWhatsapp(uri)}
          style={[
            styles.button,
            {height: 50, width: 50, borderRadius: 50, marginHorizontal: 10},
          ]}>
          <Icon name="logo-whatsapp" size={30} color={'#fff'} />
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
