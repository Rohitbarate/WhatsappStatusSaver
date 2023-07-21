import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  BackHandler,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';
import * as ScopedStoragePackage from 'react-native-scoped-storage';
import RNFetchBlob from 'rn-fetch-blob';

const SelectedStatus = ({route, navigation}) => {
  const {uri, statusName, item} = route.params;
  // const URI = JSON.parse(uri)

  // const WhatsAppStatusDirectory = `${RNFS.ExternalStorageDirectoryPath}/Android/media/com.whatsapp/Whatsapp/Media/.Statuses/`;

  // const WhatsAppStatusDirectory = `${RNFetchBlob.fs.dirs.SDCardDir}/Android/media/com.whatsapp/Whatsapp/Media/.Statuses/`;
  console.log({URIFROMSAVED: uri});

  const video = /\.(mp4)$/i;
  const image = /\.(jpg|jpeg|png|gif)$/i;

  const handleShareToWhatsapp = async url => {
   let link;
    try {
     
      Share.isPackageInstalled('com.whatsapp')
        .then(response => {
          console.log({response});
          response.isInstalled = true;
          if (response.isInstalled) {
            ToastAndroid.show('Sharing with Whatsapp', ToastAndroid.SHORT);
            RNFS.stat(url).then((res)=>{
              console.log({share:res})
              link = res.path
            }).catch((er)=>{
              console.log({er});
            })
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

  const listFiles = async () => {
    const contentUri =
      'content://com.android.externalstorage.documents/tree/primary:Android/media/com.whatsapp/WhatsApp/Media/.Statuses';

    try {
      const res = await RNFetchBlob.config({
        fileCache: true,
      }).ls(contentUri);
      console.log({res});
      const files = res.map(file => ({
        path: file.path(),
        name:
          Platform.OS === 'android'
            ? file.filename()
            : file.path().split('/').pop(),
        size: file.size(),
        mime: file.type(),
      }));

      console.log(files);
      // Use the file list as needed
    } catch (error) {
      console.log('Error:', error);
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
      mime: item.mime,
    });

    try {
      const isExist = await RNFS.exists(destUrl + '/' + statusName);
      if (isExist) {
        ToastAndroid.show('Status is Already Downloaded', ToastAndroid.SHORT);
      } else {
        createDestFile(sourceUrl, destUrl);
      }
      // await ScopedStoragePackage.copyFile(
      //   "content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses/document/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses%2Fcdacb2952f96422790168cb970dd6e20.jpg",
      //   `/data/user/0/com.wistatussaver/files/Media/Statuses/cdacb2952f96422790168cb970dd6e20.jpg`,
      //   msg => {
      //     console.log('ScopedStorage.copyFile msg: ', msg);
      //     ToastAndroid.show(msg,ToastAndroid.SHORT)
      //   },
      // );
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
        item.mime,
      );
      console.log({des});
      if (des.uri) {
        copyFileFunction(sourceUrl, des.uri);
      } else {
        ToastAndroid.show(
          'error to download file, try again',
          ToastAndroid.SHORT,
        );
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
    });
  };

  return (
    <View style={styles.container}>
      {statusName.indexOf('.jpg' || '.jpeg' || '.png') !== -1 ? (
        <View
          style={{
            width: Dimensions.get('window').width - 20,
            backgroundColor: 'red',
            alignItems: 'center',
            height: 500,
            borderRadius: 10,
            overflow: 'hidden',
          }}>
          <Image source={{uri: uri}} style={styles.image} />
        </View>
      ) : (
        <Video
          source={{uri: uri}}
          style={styles.video}
          controls={true}
          //   fullscreen={true}
          posterResizeMode="contain"
          resizeMode="contain"
        />
      )}
      <View>
        <Text style={{color: '#000'}}>{statusName}</Text>
      </View>
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
          onPress={() => downloadStatusHandler(uri, statusName)}
          style={[
            styles.button,
            {height: 65, width: 65, borderRadius: 65, marginHorizontal: 10},
          ]}>
          <Icon name="ios-arrow-down" size={40} color={'#fff'} />
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
  video: {
    // aspectRatio:
    //   Dimensions.get('window').width / Dimensions.get('window').height,
    backgroundColor: '#000',
    width: Dimensions.get('window').width - 20,
    height: 500,
    borderRadius: 10,
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
