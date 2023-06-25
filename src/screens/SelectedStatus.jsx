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

const SelectedStatus = ({route, navigation}) => {
  const {uri, statusName} = route.params;

  const handleShareToWhatsapp = async url => {
    try {
      Share.isPackageInstalled('com.whatsapp')
        .then(response => {
          console.log({response});
          if (response.isInstalled) {
            ToastAndroid.show('Sharing with Whatsapp', ToastAndroid.SHORT);
            Share.shareSingle({
              url: url,
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

  const handleShare = url => {
    console.log({url});
    try {
      Share.open({
        url: url,
        failOnCancel: false,
      }).catch(error => {
        ToastAndroid.show(error, ToastAndroid.LONG);
      });
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
    }
  };

  const downloadStatusHandler = async (url, statusName) => {
    const destPath = `${RNFS.DocumentDirectoryPath}/Media/Statuses/`;
    console.log(destPath);
    try {
      await RNFS.mkdir(destPath);
      await RNFS.copyFile(url, destPath + '/' + statusName);
      ToastAndroid.show('Status saved successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.log({errorToDownload: error});
      ToastAndroid.show(error, ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      {statusName.indexOf('.jpg' || '.jpeg' || '.png') !== -1 ? (
        <View
          style={{
            width: Dimensions.get('window').width - 20,
            backgroundColor: 'red',
            alignItems:'center',
            height:500,
            borderRadius:10,
            overflow:'hidden'
          }}>
          <Image source={{uri: `file://${uri}`}} style={styles.image} />
        </View>
      ) : (
        <Video
          source={{uri: `file://${uri}`}}
          style={styles.video}
          controls={true}
          //   fullscreen={true}
          posterResizeMode="contain"
          resizeMode="contain"
        />
      )}
      <View style={styles.btnView}>
        <TouchableOpacity
          onPress={() => handleShare(`file://${uri}`)}
          style={[
            styles.button,
            {height: 50, width: 50, borderRadius: 50, marginHorizontal: 10},
          ]}>
          <Icon name="ios-share-social-outline" size={30} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => downloadStatusHandler(`file://${uri}`, statusName)}
          style={[
            styles.button,
            {height: 65, width: 65, borderRadius: 65, marginHorizontal: 10},
          ]}>
          <Icon name="ios-arrow-down" size={40} color={'#fff'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleShareToWhatsapp(`file://${uri}`)}
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
